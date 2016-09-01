import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { getCurlCommandFromOperation, getMarkdownCodeBlock, maybeGetFileContents } from './utils';

const DOC_PARSE_IDENT = '#doc:';
const DOC_TYPE_RESOURCE_OPERATION = 'resource:operation';
const DOC_TYPE_RESOURCE = 'resource';
const DOC_TYPE_MODEL = 'model';
const DOC_TYPE_ENUM = 'enum';
const DOC_TYPE_SECTION = 'section';
const DOC_TYPE_MODULE = 'module';
const DOC_TYPE_JSON_EXAMPLE = 'json:example';
const DOC_TYPE_INCLUDE = 'include';

export function isDocParse(str) {
  return str.startsWith(DOC_PARSE_IDENT);
}

export function isJsonDocParse(str) {
  return str.startsWith(`${DOC_PARSE_IDENT}json`);
}

export function isIncludeDocParse(str) {
  return str.startsWith(`${DOC_PARSE_IDENT}${DOC_TYPE_INCLUDE}`);
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

export function getSection(part) {
  if (getType(part) !== DOC_TYPE_SECTION) {
    throw new Error(`Expected type to be ${DOC_TYPE_SECTION}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  const name = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_SECTION, '')
    .trim();

  return {
    type: DOC_TYPE_SECTION,
    name,
  };
}

export function getModule(part) {
  if (getType(part) !== DOC_TYPE_MODULE) {
    throw new Error(`Expected type to be ${DOC_TYPE_MODULE}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  const name = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_MODULE, '')
    .trim();

  return {
    type: DOC_TYPE_MODULE,
    name,
  };
}

/**
 * Convert a `#doc:json:example` doc part into example request and response json.
 *
 * This is meant to replace content in an existing markdown file, not return
 * meta data about the doc type to be referenced later.
 *
 * @param  {string} part a `#doc:json:example <json_example_path>` doctype
 */
export function getJsonExample(part) {
  if (getType(part) !== DOC_TYPE_JSON_EXAMPLE) {
    throw new Error(`Expected type to be ${DOC_TYPE_JSON_EXAMPLE}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  // #doc:json:example [[[experiences/post/:organization/experiences/simple]]]
  const jsonPath = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_JSON_EXAMPLE, '')
    .trim();

  // experiences/[[[post]]]/:organization/experiences/simple
  const method = jsonPath.split('/')[1];

  // experiences/post/[[[:organization/experiences]]]/simple
  const operationPath = jsonPath.split('/').slice(2, -1).join('/');

  const jsonBasePath = path.resolve(process.cwd(), 'examples');
  const requestJson = maybeGetFileContents(`${jsonBasePath}/${jsonPath}.request.json`);
  const requestJsonQuery = maybeGetFileContents(`${jsonBasePath}/${jsonPath}.request.query`);
  const responseJson = maybeGetFileContents(`${jsonBasePath}/${jsonPath}.response.json`);
  const curl = getCurlCommandFromOperation({
    method,
    path: `/${operationPath}`,
  }, requestJsonQuery)
  // getCurlCommandFromOperation return html entities, replace them with the
  // actual characters
  .replace('&lt;', '<').replace('&gt;', '>');

  if (typeof requestJson === 'undefined' && typeof responseJson === 'undefined') {
    // eslint-disable-next-line max-len
    throw new Error(`Could not find request or response json at ${jsonBasePath}/${jsonPath}. Expected at least one in order to display example to user.`);
  }

  let requestBlock = '';
  let responseBlock = '';

  if (typeof requestJson !== 'undefined') {
    requestBlock = `body.json
${getMarkdownCodeBlock(requestJson, 'JSON')}
`;
  }

  if (typeof responseJson !== 'undefined') {
    responseBlock = `API Response
${getMarkdownCodeBlock(responseJson, 'JSON')}
`;
  }

  return `
${getMarkdownCodeBlock(curl, 'Bash')}
${requestBlock}
${responseBlock}`;
}

export function getInclude(part) {
  if (getType(part) !== DOC_TYPE_INCLUDE) {
    throw new Error(`Expected type to be ${DOC_TYPE_INCLUDE}, but got ${getType(part)} instead`); // eslint-disable-line max-len
  }

  // #doc:include [path/to/markdown.md]
  const mdPath = part
    .replace(DOC_PARSE_IDENT, '')
    .replace(DOC_TYPE_INCLUDE, '')
    .trim();

  let filePath;

  if (mdPath.startsWith('/')) {
    filePath = mdPath;
  } else {
    filePath = path.resolve(process.cwd(), mdPath);
  }

  const fileContents = maybeGetFileContents(filePath);

  return fileContents;
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
  case DOC_TYPE_SECTION:
    return getSection(part);
  case DOC_TYPE_MODULE:
    return getModule(part);
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

/**
 * Given a markdown file, locate the `#doc:json:example` references and replace
 * them with new markdown with example curl, request and response code blocks.
 *
 * @param  {string} fileContents the contents of a markdown file
 * @param  {Object} opts
 * @param  {Object} opts.filePath   The filesystem location of `fileContents`
 * @return {[type]}                 The replaced content
 */
export function replaceJsonReferences(fileContents, opts) {
  const lines = fileContents.split('\n');
  let replacedContent = '';
  lines.forEach((line, lineNumber) => {
    try {
      if (isJsonDocParse(line)) {
        replacedContent += `${getJsonExample(line)}\n`;
      } else {
        replacedContent += `${line}\n`;
      }
    } catch (err) {
      throw new Error(`Error parsing file[${opts.fileName}] on line ${lineNumber + 1}:\n\n ${line}\n\n ${err.stack}`); // eslint-disable-line max-len
    }
  });

  return replacedContent;
}

export function replaceIncludes(fileContents, opts) {
  const lines = fileContents.split('\n');
  let replacedContent = '';
  lines.forEach((line, lineNumber) => {
    try {
      if (isIncludeDocParse(line)) {
        replacedContent += `${getInclude(line)}\n`;
      } else {
        replacedContent += `${line}\n`;
      }
    } catch (err) {
      throw new Error(`Error parsing file[${opts.fileName}] on line ${lineNumber + 1}:\n\n ${line}\n\n ${err.stack}`); // eslint-disable-line max-len
    }
  });

  return replacedContent;
}

export function parse(globStr) {
  return new Promise((resolve, reject) => {
    glob(globStr, (err, files) => {
      if (err) {
        reject(err);
      }

      // convert each file in glob to array of DocParts
      const docsPerFile = files.map((f) => {
        const filePath = path.join(process.cwd(), f);
        const fileContents = fs.readFileSync(filePath).toString('utf-8');
        const replaceOpts = { fileName: filePath };
        const fileContentsReplaced = replaceIncludes(replaceJsonReferences(fileContents, replaceOpts), replaceOpts); // eslint-disable-line max-len
        return parseFile(fileContentsReplaced, { fileName: filePath });
      });

      // TODO: Check result for duplicates, throw error/warning if so.

      // flatten the docs
      resolve(docsPerFile.reduce((prev, next) => prev.concat(next), []));
    });
  });
}

export default { parse };
