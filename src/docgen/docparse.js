import fs from 'fs';
import glob from 'glob';
import path from 'path';

const DOC_PARSE_IDENT = '#doc:';
const DOC_TYPE_RESOURCE_OPERATION = 'resource:operation';
const DOC_TYPE_RESOURCE = 'resource';
const DOC_TYPE_MODEL = 'model';
const DOC_TYPE_ENUM = 'enum';

export function isDocParse(str) {
  return str.startsWith(DOC_PARSE_IDENT);
}

export function getType(str) {
  if (!isDocParse(str)) {
    throw new Error(`Not a DocParse Statement: \n\n${str}`);
  }

  return str.replace(DOC_PARSE_IDENT, '').split(' ')[0];
}

const trimFilter = (arr) => arr.filter((a) => !!a);

export function getResourceOperation(part) {
  if (getType(part) !== DOC_TYPE_RESOURCE_OPERATION) {
    throw new Error(`Expected type to be ${DOC_TYPE_RESOURCE_OPERATION}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  const resource = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_RESOURCE_OPERATION, '');
  const resourceParts = trimFilter(resource.split(' ')).map((p) => {
    if (p.includes('\n')) {
      return p.slice(0, p.indexOf('\n'));
    }
    return p;
  });

  const method = resourceParts[0].trim();
  const resourcePath = resourceParts[1].trim();

  return {
    type: DOC_TYPE_RESOURCE_OPERATION,
    method,
    path: resourcePath,
  };
}

export function getResource(part) {
  if (getType(part) !== DOC_TYPE_RESOURCE) {
    throw new Error(`Expected type to be ${DOC_TYPE_RESOURCE}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  const name = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_RESOURCE, '')
    .trim();

  return {
    type: DOC_TYPE_RESOURCE,
    name,
  };
}

export function getModel(part) {
  if (getType(part) !== DOC_TYPE_MODEL) {
    throw new Error(`Expected type to be ${DOC_TYPE_MODEL}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  const name = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_MODEL, '')
    .trim();

  return {
    type: DOC_TYPE_MODEL,
    name,
  };
}

export function getEnum(part) {
  if (getType(part) !== DOC_TYPE_ENUM) {
    throw new Error(`Expected type to be ${DOC_TYPE_ENUM}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  const name = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_ENUM, '')
    .trim();

  return {
    type: DOC_TYPE_ENUM,
    name,
  };
}

export function getDocPart(part) {
  const type = getType(part);
  switch (type) {
  case DOC_TYPE_RESOURCE_OPERATION:
    return getResourceOperation(part);
  case DOC_TYPE_RESOURCE:
    return getResource(part);
  case DOC_TYPE_MODEL:
    return getModel(part);
  case DOC_TYPE_ENUM:
    return getEnum(part);
  default:
    throw new Error(`Type not found: ${type}`);
  }
}

export function parseFile(fileContents, opts) {
  const lines = fileContents.split('\n');
  let docPart = null;
  let docParts = [];
  let docPartContent = '';

  lines.forEach((line, lineNumber) => {
    try {
      if (isDocParse(line)) {
        if (docPart) {
          docParts = docParts.concat(Object.assign(docPart, { content: docPartContent }));
        }
        docPartContent = '';
        docPart = getDocPart(line);
      } else {
        if (docPart) {
          docPartContent += `${line}\n`;
        }
      }
    } catch (err) {
      throw new Error(`Error parsing file[${opts.fileName}] on line ${lineNumber + 1}:\n\n ${line}\n\n ${err.stack}`); // eslint-disable-line max-len
    }
  });

  docParts = docParts.concat(Object.assign(docPart, { content: docPartContent }));

  return docParts;
}

export function parse(globStr) {
  return new Promise((resolve, reject) => {
    glob(globStr, (err, files) => {
      if (err) {
        reject(err);
      }

      const partsOfParts = files.map((f) => {
        const filePath = path.join(process.cwd(), f);
        const fileContents = fs.readFileSync(filePath).toString('utf-8');
        return parseFile(fileContents, { fileName: filePath });
      });

      resolve(partsOfParts.reduce((prev, next) => prev.concat(next), []));
    });
  });
}

export default { parse };
