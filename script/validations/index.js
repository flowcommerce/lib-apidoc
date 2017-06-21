import path from 'path';
import mkdirp from 'mkdirp';

import generateAPI from './utilities/generate-api';
import api from '../../api.json';
import copyFiles from './utilities/copy-files';

const cwd = process.cwd();
const utilitiesRoot = path.resolve(__dirname, './utilities');
const destinationPath = path.resolve(cwd, 'src/validators/utilities');

mkdirp(destinationPath);

export function generate() {
  copyFiles([
    `${utilitiesRoot}/is-primative.js`,
    `${utilitiesRoot}/validate-array.js`,
    `${utilitiesRoot}/validate-enum.js`,
    `${utilitiesRoot}/validate-model.js`,
    `${utilitiesRoot}/validate-union.js`,
    `${utilitiesRoot}/validated-fields-to-object.js`,
    `${utilitiesRoot}/validation-error.js`,
    `${utilitiesRoot}/validate-apidoc-type.js`,
  ], destinationPath);
  generateAPI('api', api);
}

export default generate;
