import path from 'path';
import { loadTemplate } from '../util/handlebars';

const template = loadTemplate(path.join(__dirname, '../templates/index.hbs'));

/**
 * Generated the index of the client. This is the interface to all of the
 * resources available in the service.
 *
 * - Exports a single Class encapsulating all of the individual resources of
 *   the apidoc service. Properties on this class are instances of each resource
 *   class.
 * - Class also exposes an `enums` property that will contain all of the enum
 *   values from the apidoc service
 *
 * @param  {Object} service Object representation of the apidoc service
 * @return {Object}                    Object containing file contents
 *                  files.contents     File contents
 *                  files.path         Path (recommended) of the file
 */
export function generate(service) {
  const contents = template(service);
  const filePath = 'index.js';

  return { contents, path: filePath };
}

export default { generate };
