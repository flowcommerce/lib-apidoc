import fs from 'fs';
import glob from 'glob';
import path from 'path';

function getType(str) {
  return str.split(' ')[0];
}

const trimFilter = (arr) => arr.filter((a) => !!a);

function getResourceOperation(part) {
  const resource = part.replace('resource:operation', '');
  const resourceParts = trimFilter(resource.split(' ')).map((p) => {
    if (p.includes('\n')) {
      return p.slice(0, p.indexOf('\n'));
    }
    return p;
  });

  const method = resourceParts[0];
  const resourcePath = resourceParts[1];
  const content = part.slice(part.indexOf(resourcePath) + resourcePath.length);


  return {
    type: 'resource',
    method,
    path: resourcePath,
    content,
  };
}

function getDocPart(part) {
  const type = getType(part);

  switch (type) {
  case 'resource:operation':
    return getResourceOperation(part);
  default:
    throw new Error(`Type not found: ${type}`);
  }
}

export function parse(globStr) {
  return new Promise((resolve, reject) => {
    glob(globStr, (err, files) => {
      if (err) {
        reject(err);
      }

      const partsOfParts = files.map((f) => {
        const testMd = fs.readFileSync(path.join(process.cwd(), f)).toString('utf-8');
        const docParts = testMd.split('#doc:');
        const parsedParts = trimFilter(docParts).map((part) => getDocPart(part));
        return parsedParts;
      });

      resolve(partsOfParts.reduce((prev, next) => prev.concat(next), []));
    });
  });
}

export default { parse };
