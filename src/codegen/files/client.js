import path from 'path';
import { loadTemplate } from '../util/handlebars';

const template = loadTemplate(path.join(__dirname, '../templates/client.hbs'));

export function generate() {
  const contents = template();
  const filePath = 'client.js';

  return { contents, path: filePath };
}

export default { generate };
