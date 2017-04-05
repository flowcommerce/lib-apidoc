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

handlebars.registerHelper('toCamelCase', (str) => toCamelCase(str));

handlebars.registerHelper('jsArrayStr', (values) =>
  serviceUtil.getJsArrayStr(values));

handlebars.registerHelper('operationName', (operation, resourcePath) =>
  serviceUtil.getFunctionName(operation, resourcePath));

handlebars.registerHelper('parameterList', (operation) =>
  serviceUtil.getFunctionParamsStr(operation));

handlebars.registerHelper('operationPath', (operation) =>
  serviceUtil.getEndpointUriStr(operation));

// eslint-disable-next-line func-names
handlebars.registerHelper('nonGetMethod', function (operation, options) {
  return operation.method !== 'GET' ? options.fn(this) : options.inverse(this);
});

export function loadTemplate(path) {
  const fileContents = fs.readFileSync(path).toString('utf-8');
  const hbs = handlebars.compile(fileContents);
  return hbs;
}

export default { loadTemplate };
