import isArray from 'lodash/fp/isArray';
import map from 'lodash/fp/map';

import { typeMismatchError } from './validation-error';

const validateArray = (validator, values) => {
  if (!isArray(values)) {
    return typeMismatchError(values, 'array');
  }
  return map(value => validator(value), values);
};

module.exports = validateArray;
