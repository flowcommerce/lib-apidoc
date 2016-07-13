import { toCamelCase, slug } from './strings';
import serviceUtil from './service';

function getOperation(operation, path) {
  const parametersPath = operation.parameters.filter((p) => p.location === 'Path');
  const parametersQuery = operation.parameters.filter((p) => p.location === 'Query');

  const op = {
    name: serviceUtil.getFunctionName(operation, path),
    parameterString: serviceUtil.getFunctionParamsStr(operation),
    parameters: operation.parameters,
    parametersPath,
    parametersQuery,
    hasParametersPath: parametersPath.length > 0,
    hasParametersQuery: parametersQuery.length > 0,
  };

  if (operation.body) {
    op.body = operation.body;
  }

  return op;
}

export default function serviceToJson(service) {
  const resources = service.resources.map((resource) => ({
    name: toCamelCase(slug(resource.plural)),
    operations: resource.operations.map((operation) => getOperation(operation, resource.path)),
    description: resource.description,
  }));

  return {
    name: service.name,
    version: service.version,
    resources,
  };
}
