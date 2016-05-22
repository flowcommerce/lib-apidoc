import path from 'path';
import { loadTemplate } from '../util/handlebars';

const template = loadTemplate(path.join(__dirname, '../templates/index.hbs'));

export function generate(service) {
  const contents = template(service);
  const filePath = 'index.js';

  return { contents, path: filePath };
}

export default { generate };
