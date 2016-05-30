import path from 'path';
import { loadTemplate } from '../util/handlebars';

const template = loadTemplate(path.join(__dirname, '../templates/logger.hbs'));

export function generate() {
  const contents = template();
  const filePath = 'logger.js';

  return { contents, path: filePath };
}

export default { generate };
