import curry from 'lodash/fp/curry';
import map from 'lodash/fp/map';
import find from 'lodash/fp/find';
import includes from 'lodash/fp/includes';

import { fieldRequiredError, genericError, invalidDiscriminatorError } from './validation-error';

const validateUnion = curry((spec, validators, union) => {
  if (!union.discriminator) {
    return fieldRequiredError('discriminator');
  }

  const validDiscriminators = map(t => t.type, spec.types);

  if (!includes(validDiscriminators, union.discriminator)) {
    return invalidDiscriminatorError(union.discriminator, validDiscriminators);
  }

  const type = find(t => t.type === union.discriminator, spec.types);
  const validate = validators[type.type];

  if (!validate) {
    // eslint-disable-next-line prefer-template
    return genericError(type.type, 'Could not find validate function for type [' + type.type + ']');
  }

  return validate(union);
});

export default validateUnion;
