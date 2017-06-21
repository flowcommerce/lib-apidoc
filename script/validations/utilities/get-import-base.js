import getModelCategory from './get-model-category';

/**
 * Determines base import path for validations for other validators inside
 * ./src/validators/{API_KEY}
 *
 * @param  {string} fileCategory Apidoc model category: enum, model or union
 * @param  {string} importType   The name property of an apidoc enum, model or union
 * @param  {Object} apiData      The full apidoc api definition
 */
const getImportBase = (fileCategory, importType, apiData) => {
  const category = getModelCategory(importType, apiData);

  if (fileCategory === category) {
    return '.';
  }

  return `../${category}s`;
};

export default getImportBase;
