import { generate as generateLoggerFile } from './files/logger';
import { generate as generateClientFile } from './files/client';
import { generate as generateIndexFile } from './files/index';
import { generate as generateResourceFile } from './files/resource';

const defaultOpts = {
  /**
   * Path to `client.js` relative to generated resource javascript files. Useful when
   * generating clients from multiple services to share a single client class.
   *
   * @type {String}
   */
  clientImportPath: '.',
};

/**
 * Generate code for the given service.
 *
 * @param  {Object} service            Object representation of the apidoc
 *                                     service
 * @param  {Object} [opts=defaultOpts] Configuration options for code generation
 * @return {Object}                    Object containing file contents
 *                  files.contents     File contents
 *                  files.path         Path (recommended) of the file
 */
export function generate(service, opts = defaultOpts) {
  const staticFiles = [
    generateLoggerFile(),
    generateClientFile(),
    generateIndexFile(service),
  ];

  const resourceFiles = service.resources.map(resource =>
    generateResourceFile(resource, service.name, opts.clientImportPath));

  const files = staticFiles.concat(resourceFiles);

  return { files };
}

export default { generate };
