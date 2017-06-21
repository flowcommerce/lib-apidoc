import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import curry from 'lodash/fp/curry';
import find from 'lodash/fp/find';
import kebabCase from 'lodash/kebabCase';
import template from 'lodash/template';
import forEach from 'lodash/fp/forEach';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';
import negate from 'lodash/fp/negate';
import flow from 'lodash/fp/flow';
import camelCase from 'lodash/fp/camelCase';
import uniq from 'lodash/fp/uniq';

import isPrimative from './is-primative';
import getImportBase from './get-import-base';

const basePath = `${process.cwd()}/src/validators`;
const modelTemplate = template(fs.readFileSync(path.resolve(__dirname, '../templates/model.tpl')));
const enumTemplate = template(fs.readFileSync(path.resolve(__dirname, '../templates/enum.tpl')));
const unionTemplate = template(fs.readFileSync(path.resolve(__dirname, '../templates/union.tpl')));

const isApidocArrayType = type => /^\[(.+)\]$/.test(type);
const hasPrimativeType = field => isPrimative(field.type);
const removePrimatives = fields => filter(negate(hasPrimativeType), fields);
const convertToImports = curry((fileCategory, apiSpec, types) => map((type) => ({
  variableName: camelCase(`validate_${type}`),
  path: `${getImportBase(fileCategory, type, apiSpec)}/${kebabCase(type)}`,
}), types));
const convertToValidateCases = fields => map((type) => ({
  type,
  isArray: isApidocArrayType(type),
  functionName: camelCase(`validate_${type}`),
}), fields);
const mapToTypes = fields => map(f => f.type, fields);
const mapToValidators = (types) => map(type => ({
  type,
  variableName: camelCase(`validate_${type}`),
}), types);
const addUtilityImports = types => {
  const imports = [];

  if (find(isApidocArrayType, types)) {
    imports.push({ variableName: 'validateArray', path: '../../utilities/validate-array' });
  }

  return imports;
};


export default function generateAPI(key, apiSpec) {
  const apiSrcPath = `${basePath}/${key}`;

  mkdirp.sync(`${apiSrcPath}/models`);
  mkdirp.sync(`${apiSrcPath}/enums`);
  mkdirp.sync(`${apiSrcPath}/unions`);

  //
  // Models
  //
  forEach((model) => {
    const fileName = kebabCase(model.name);
    const imports = flow(
      removePrimatives,
      mapToTypes,
      uniq,
      convertToImports('model', apiSpec),
    )(model.fields);
    const builtInImports = flow(
      removePrimatives,
      mapToTypes,
      uniq,
      addUtilityImports,
    )(model.fields);
    const validatorCases = flow(
      removePrimatives,
      mapToTypes,
      uniq,
      convertToValidateCases,
    )(model.fields);
    const templateData = {
      spec: model,
      imports: [...builtInImports, ...imports],
      validatorCases,
    };

    const jsContent = modelTemplate(templateData);

    fs.writeFileSync(`${apiSrcPath}/models/${fileName}.js`, jsContent);
  }, apiSpec.models);

  //
  // Enums
  //
  forEach((e) => {
    const fileName = kebabCase(e.name);
    const templateData = {
      spec: e,
    };
    const jsContent = enumTemplate(templateData);
    fs.writeFileSync(`${apiSrcPath}/enums/${fileName}.js`, jsContent);
  }, apiSpec.enums);


  //
  // Unions
  //
  forEach((u) => {
    const fileName = kebabCase(u.name);
    const imports = flow(
      mapToTypes,
      convertToImports('union', apiSpec),
    )(u.types);
    const validators = flow(
      mapToTypes,
      mapToValidators,
    )(u.types);
    const templateData = {
      spec: u,
      imports,
      validators,
    };
    const jsContent = unionTemplate(templateData);
    fs.writeFileSync(`${apiSrcPath}/unions/${fileName}.js`, jsContent);
  }, apiSpec.unions);
}
