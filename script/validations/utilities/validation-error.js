export const GENERIC_ERROR = 'GENERIC_ERROR';
export const TYPE_MISMATCH_ERROR = 'TYPE_MISMATCH_ERROR';
export const FIELD_REQUIRED_ERROR = 'FIELD_REQUIRED_ERROR';
export const INVALID_ENUM_VALUE_ERROR = 'INVALID_ENUM_VALUE_ERROR';
export const INVALID_UNION_DISCRIMINATOR_ERROR = 'INVALID_UNION_DISCRIMINATOR_ERROR';
export const INVALID_VALUE_FORMAT = 'INVALID_VALUE_FORMAT';

export const genericError = (value, message, other) => ({
  code: GENERIC_ERROR,
  value,
  message,
  ...other,
});

export const invalidValueFormat = (value, format, other) => ({
  code: INVALID_VALUE_FORMAT,
  value,
  format,
  ...other,
});

export const fieldRequiredError = (name) => ({
  code: FIELD_REQUIRED_ERROR,
  name,
});


export const typeMismatchError = (value, expected, other) => ({
  code: TYPE_MISMATCH_ERROR,
  value,
  actual: typeof value,
  expected,
  ...other,
});

export const invalidEnumValue = (value, expected) => ({
  code: INVALID_ENUM_VALUE_ERROR,
  value,
  expected,
});

export const invalidDiscriminatorError = (value, expected) => ({
  code: INVALID_UNION_DISCRIMINATOR_ERROR,
  value,
  expected,
});
