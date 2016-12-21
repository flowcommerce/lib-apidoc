import path from 'path';
import { loadTemplate } from '../util/handlebars';

const template = loadTemplate(path.join(__dirname, '../templates/client.hbs'));

/**
 * Generate the client class used by all resource files.
 *
 * @return {Object}                    Object containing file contents
 *                  files.contents     File contents
 *                  files.path         Path (recommended) of the file
 */
export function generate() {
  const contents = template();
  const filePath = 'client.js';

  return { contents, path: filePath };
}

export default { generate };
