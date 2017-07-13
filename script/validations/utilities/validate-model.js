import curry from 'lodash/fp/curry';
import map from 'lodash/fp/map';
import get from 'lodash/fp/get';
import isNil from 'lodash/fp/isNil';
import omitBy from 'lodash/fp/omitBy';
import flow from 'lodash/fp/flow';

import validatedFieldsToObject from './validated-fields-to-object';
import { fieldRequiredError, typeMismatchError } from './validation-error';

/**
 * Validate a single field.
 */
const validateField = curry((model, validator, field) => {
  const value = get(field.name, model);

  if (field.required && isNil(value)) {
    return { [field.name]: fieldRequiredError(field.name) };
  }

  return validator(field, value);
});

/**
 * Validate multiple fields.
 */
const validateFields = curry((model, validator, fields) =>
  map(validateField(model, validator), fields));

/**
 * Convert list of validated fields into an object representation that matches the model.
 */
const fieldsListToObject = fields => validatedFieldsToObject(fields);

/**
 * Remove model properties that were valid.
 */
const removeValidValidProperties = (validated) => omitBy(isNil, validated);

/**
 * Validate an apidoc model.
 *
 * This function can be partially applied.
 *
 * @param {Object}    spec          The apidoc model definition
 * @param {function}  validator     Function to validate fields of the model.
 * @param {Object}    model         The value to validate.
 */
const validateModel = curry((spec, validator, model) => {
  if (typeof model !== 'object') {
    return typeMismatchError(model, 'object');
  }

  return flow(
    validateFields(model, validator),
    fieldsListToObject,
    removeValidValidProperties
  )(spec.fields);
});

export default validateModel;
