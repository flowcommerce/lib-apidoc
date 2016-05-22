import { toCamelCase, capitalizeFirstLetter, slug } from './strings';

function getPathParameters(operation) {
  return operation.parameters.filter((param) => param.location === 'Path');
}

export function getFunctionParamsStr(operation) {
  const params = getPathParameters(operation).map((p) => toCamelCase(p.name));
  return params.concat(['options']).join(', ');
}

/**
 * Turn 'GET /:id/passengers' into 'getPassengersById'
 */
export function getFunctionName(operation, resourcePath) {
  if (operation.path) {
    let pathWithOutPrefix = operation.path.replace(resourcePath, '');

    if (pathWithOutPrefix.startsWith('/')) {
      pathWithOutPrefix = pathWithOutPrefix.slice(1);
    }

    const parts = pathWithOutPrefix.split('/');
    const variableParts = parts
      .filter((p) => p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? 'By' : 'And';
        return prefix + capitalizeFirstLetter(toCamelCase(slug(part.slice(1))));
      });
    const staticParts = parts
      .filter((p) => !p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? '' : 'And';
        return prefix + capitalizeFirstLetter(toCamelCase(slug(part)));
      });
    const sortedParts = staticParts.concat(variableParts);

    return operation.method.toLowerCase() + sortedParts.join('');
  }

  return operation.method.toLowerCase();
}

function getEndpointUriStr(operation) {
  const START_LITERAL = '${';
  const END_LITERAL = '}';
  const fullPath = operation.path.slice(1);
  const parts = fullPath.split('/')
    .map((part) => {
      if (part.indexOf(':') === 0) {
        return `/${START_LITERAL}${toCamelCase(part.slice(1))}${END_LITERAL}`;
      }
      return `/${part}`;
    });

  return `${parts.join('')}`;
}

export default { getFunctionName, getFunctionParamsStr, getEndpointUriStr };
