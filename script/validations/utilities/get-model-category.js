import find from 'lodash/fp/find';

import getBaseType from './get-base-type';

/**
 * Determine the 'category' of a specific type from apidoc. The three valid
 * categories are:
 * - enum
 * - model
 * - union
 *
 * @param  {string} type    The apidoc type value from model.fields or union.types
 * @param  {Object} apiData The full api definition from apidoc
 */
const getModelCategory = (type, apiData) => {
  if (find(m => m.name === getBaseType(type), apiData.models)) {
    return 'model';
  }

  if (find(e => e.name === getBaseType(type), apiData.enums)) {
    return 'enum';
  }

  if (find(u => u.name === getBaseType(type), apiData.unions)) {
    return 'union';
  }

  throw new Error(`Could not determine api model category for type[${type}]`);
};

export default getModelCategory;
