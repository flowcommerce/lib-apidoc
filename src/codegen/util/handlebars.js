import fs from 'fs';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import startCase from 'lodash/startCase';
import handlebars from 'handlebars';
import serviceUtil from './service';
import { toCamelCase, capitalizeFirstLetter, slug } from './strings';

handlebars.registerHelper('resourceClassName', (resource) => {
  if (resource.path.startsWith('/internal')) {
    return startCase(resource.path).replace(/\s/g, '');
  }

  return startCase(resource.plural).replace(/\s/g, '');
});

handlebars.registerHelper('resourceFileName', (resource) => {
  if (resource.path.startsWith('/internal')) {
    return kebabCase(resource.path);
  }

  return kebabCase(resource.plural);
});

handlebars.registerHelper('resourceInstanceName', (resource) => {
  if (resource.path.startsWith('/internal')) {
    return camelCase(resource.path);
  }

  return camelCase(resource.plural);
});

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
