import path from 'path';
import { loadTemplate } from '../util/handlebars';
import kebabCase from 'lodash/kebabCase';

const template = loadTemplate(path.join(__dirname, '../templates/resource.hbs'));

function getFileName(resource) {
  if (resource.path.startsWith('/internal')) {
    return kebabCase(resource.path);
  }

  return kebabCase(resource.plural);
}

export function generate(resource, serviceName, clientImportPath) {
  const contents = template(Object.assign({}, resource, { serviceName, clientImportPath }));
  const filePath = `${getFileName(resource)}.js`;

  return { contents, path: filePath };
}

export default { generate };
