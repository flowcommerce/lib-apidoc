import loggerFile from './files/logger';
import clientFile from './files/client';
import indexFile from './files/index';
import resourceFile from './files/resource';

const defaultOpts = {
  clientImportPath: '.',
};

export function generate(service, opts = defaultOpts) {
  const staticFiles = [
    loggerFile.generate(),
    clientFile.generate(),
    indexFile.generate(service),
  ];

  const resourceFiles = service.resources.map(
    (resource) => resourceFile.generate(resource, service.name, opts.clientImportPath)
  );

  const files = staticFiles.concat(resourceFiles);

  return { files };
}

export default { generate };
