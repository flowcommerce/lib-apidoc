import path from 'path';
import { loadTemplate } from '../util/handlebars';
import { slug } from '../util/strings';

const template = loadTemplate(path.join(__dirname, '../templates/resource.hbs'));

/**
 * Generate code for the provided service resource.
 *
 * @param  {Object} resource         A resource object as defined by apidoc's
 *                                   service.json
 * @param  {string} serviceName      The name of the service
 * @param  {string} clientImportPath Path where client.js will located.
 * @return {Object}                    Object containing file contents
 *                  files.contents     File contents
 *                  files.path         Path (recommended) of the file
 */
export function generate(resource, serviceName, clientImportPath) {
  const contents = template(Object.assign({}, resource, { serviceName, clientImportPath }));
  const filePath = `${slug(resource.plural)}.js`;

  return { contents, path: filePath };
}

export default { generate };
