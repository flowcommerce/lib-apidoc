# Validations

Code generated validation functions for apidoc models.


## Installation

`yarn add @flowio/lib-apidoc`

## Usage


```JavaScript
import validateAddress from '@flowio/lib-apidoc/lib/validations/api/models/address';
import * as ErrorCodes from '@flowio/lib-apidoc/lib/validations/utilities/validation-error';

function formatError(error) {
  switch (error.code) {
  case ErrorCodes.TYPE_MISMATCH_ERROR:
    return `Invalid value for field. Expected ${error.expected}, but got ${error.actual} instead.`;  
  }
}

function validate(address) {
  const validated = validateAddress(address);

  const cityError = get(validated, 'city');

  if (cityError) {
    throw new Error(formatError(cityError));
  }
}
```

## Errors

When data is validated any fields that are not valid will be replaced with objects representing what the errors are. Valid fields will be stripped from the resulting object.

A model for an person:

```JavaScript
{
  name: {
    first: 'Chris',
    last: 'Hicks',
    nickname: 'chicks',
    age: '32',
  }
}
```

Assuming the `age` field was supposed to be a number the result would look like:

```JavaScript
{
  name: {
    age: {
      code: 'TYPE_MISMATCH_ERROR',
      value: '32',
      actual: 'string',
      expected: 'number',
    }
  }
}
```

## Custom Model Validation

The logic to validate models is abstracted so a custom validator can be created by specifying the `spec` for the model and the `validator` function.

The `spec` is the definition of the model as defined by apidoc

```JavaScript
const spec = {
  name: 'car',
  fields: [
    { name: 'year', type: 'integer', required: true },
    { name: 'make', type: 'string', required: true },
    { name: 'model', type: 'string', required: true },
    { name: 'sub_model', type: 'string', required: false },
    { name: 'engine', type: 'string', required: false },
  ],
};
```

The `validator` is a function that knows how to validate each field of the model

```JavaScript
// Simple validator that knows how to validate primitive apidoc types
const validator = (field, value) => {
  if (value && isPrimative(field.type)) {
    return { [field.name]: validateType(field.type, value) };
  }

  if (value) {
    switch (field.type) {
    // Add case statements to validating child models
    default:
      return { [field.name]: genericError(value, 'Unhandled field type[' + field.type + ']') };
    }
  }

  return { [field.name]: undefined };
}
```

With these you can define the validate function (combining `spec` and `validator` above):


```JavaScript
// File: ./validations/car.js
import isPrimative from '@flowio/lib-apidoc/lib/validations/utilities/is-primative';
import validateType from '@flowio/lib-apidoc/lib/validations/utilities/validate-apidoc-type';
import validateModel from '@flowio/lib-apidoc/lib/validations/utilities/validate-model';
import { genericError } from '@flowio/lib-apidoc/lib/validations/utilities/validation-error';

const validate = validateModel(spec, validator);

export default validate;
```

You can then validate a `car` model by importing the `validate` function:

```JavaScript
import validateCar from './validations/car';

const someCar = {
  make: 2009,
  make: 'Subaru',
};

const validated = validateCar(someCar);

// validated will contain an error because the `model` field is required.
// It will look like:
//
// {
//   model: {
//     code: 'FIELD_REQUIRED_ERROR',
//     name: 'model',
//   }
// }
```
