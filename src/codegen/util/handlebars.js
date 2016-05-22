import fs from 'fs';
import handlebars from 'handlebars';
import serviceUtil from './service';

import { toCamelCase, capitalizeFirstLetter, slug } from './strings';

handlebars.registerHelper('objectName', (str) =>
  capitalizeFirstLetter(toCamelCase(slug(str))));

handlebars.registerHelper('className', (str) =>
  capitalizeFirstLetter(toCamelCase(slug(str))));

handlebars.registerHelper('slug', (str) =>
  slug(str));

handlebars.registerHelper('operationName', (operation, resourcePath) =>
  serviceUtil.getFunctionName(operation, resourcePath));

handlebars.registerHelper('parameterList', (operation) =>
  serviceUtil.getFunctionParamsStr(operation));

handlebars.registerHelper('operationPath', (operation) =>
  serviceUtil.getEndpointUriStr(operation));

handlebars.registerHelper('nonGetMethod', (operation, options) => {
  if (operation.method !== 'GET') {
    return options.fn(this);
  }
  return '';
});


export function loadTemplate(path) {
  const fileContents = fs.readFileSync(path).toString('utf-8');
  const hbs = handlebars.compile(fileContents);
  return hbs;
}

export default { loadTemplate };
