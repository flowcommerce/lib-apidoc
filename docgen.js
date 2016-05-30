import docgen from './src/docgen';
import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import fulfillment from './test/codegen/fulfillment.service.json';

const markup = docgen.generate(fulfillment);
const markupPretty = html(markup, { indent_size: 2 });

fs.writeFile(path.join(__dirname, 'dist/index.html'), markupPretty);
