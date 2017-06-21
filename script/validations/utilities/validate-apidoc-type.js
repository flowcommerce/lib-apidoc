import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';

import { typeMismatchError, invalidValueFormat, genericError } from '../utilities/validation-error';
import getBaseType from './get-base-type';

export const validateBoolean = value =>
  (typeof value === 'boolean'
    ? undefined
    : typeMismatchError(value, 'boolean'));

export const validateString = value =>
  (typeof value === 'string'
    ? undefined
    : typeMismatchError(value, 'string'));

export const validateNumber = value =>
  (typeof value === 'number'
    ? undefined
    : typeMismatchError(value, 'number'));

export const validateDateIso8601 = value =>
  validateString(value) || (/^\d{4}-\d{2}-\d{2}$/.test(value)
    ? undefined
    : invalidValueFormat(value, '2014-04-29'));

export const validateDateTimeIso8601 = value =>
  validateString(value)
    || (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2})?$/.test(value)
      ? undefined
      : invalidValueFormat(value, '2014-04-29T11:56:52Z'));

export const validateDecimal = validateNumber;

export const validateDouble = validateNumber;

export const validateInteger = value =>
  validateNumber(value) || (!/\.+/.test(value.toString())
    ? undefined
    : invalidValueFormat(value, 'nn', { expected: 'integer' }));

export const validateLong = value =>
  validateNumber(value) || (!/\.+/.test(value.toString())
    ? undefined
    : invalidValueFormat(value, 'nnn', { expected: 'long' }));

export const validateObject = (value) =>
  (typeof value === 'object'
    ? undefined
    : typeMismatchError(value, 'object'));


export const validateObjectValues = (value, type) => {
  const base = getBaseType(type);

  return validateObject(value) || reduce(
    (item, obj) => ({ ...obj, ...item }),
    {},
    map((k) => ({ [k]: validateType(base, value[k]) }), Object.keys(value))
  );
};

export const validateUnit = value =>
  (value === null || value === undefined
    ? undefined
    : typeMismatchError(value, 'undefined'));

export const validateUuid = value =>
  validateString(value)
    || (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
      ? undefined
      : invalidValueFormat(value, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', { expected: 'uuid' }));

export const validateType = (type, value) => {
  switch (type) {
  case 'boolean':
    return validateBoolean(value);
  case 'date-iso8601':
    return validateDateIso8601(value);
  case 'date-time-iso8601':
    return validateDateTimeIso8601(value);
  case 'decimal':
    return validateDecimal(value);
  case 'double':
    return validateDouble(value);
  case 'integer':
    return validateInteger(value);
  case 'long':
    return validateLong(value);
  case 'object':
    return validateObject(value);
  case 'string':
    return validateString(value);
  case 'unit':
    return validateUnit(value);
  case 'uuid':
    return validateUuid(value);
  default:
    // Maps
    if (/^map/.test(type)) {
      return validateObjectValues(value, type);
    }

    // Arrays
    if (/^\[(.+)\]$/.test(type)) {
      if (!(value instanceof Array)) {
        return typeMismatchError(value, 'Array');
      }

      return value.map(v => validateType(getBaseType(type), v));
    }

    return genericError(value, 'Expected primitive apidoc type');
  }
};

export const validateField = (field, value) => validateType(field.type, value);

export default validateType;
