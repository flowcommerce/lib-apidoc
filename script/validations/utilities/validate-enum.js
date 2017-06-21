import curry from 'lodash/fp/curry';
import map from 'lodash/fp/map';
import includes from 'lodash/fp/includes';

import { typeMismatchError, invalidEnumValue } from './validation-error';

/**
 * Validate an enum type field.
 */
const validateEnum = curry((spec, value) => {
  if (typeof value !== 'string') {
    return typeMismatchError(value, 'string');
  }

  const values = map(v => v.name, spec.values);

  if (!includes(value, values)) {
    return invalidEnumValue(value, values);
  }

  return undefined;
});

export default validateEnum;
