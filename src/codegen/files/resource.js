import path from 'path';
import { loadTemplate } from '../util/handlebars';
import { slug } from '../util/strings';

const template = loadTemplate(path.join(__dirname, '../templates/resource.hbs'));

export function generate(resource, serviceName, clientImportPath) {
  const contents = template(Object.assign({}, resource, { serviceName, clientImportPath }));
  const filePath = `${slug(resource.plural)}.js`;

  return { contents, path: filePath };
}

export default { generate };
