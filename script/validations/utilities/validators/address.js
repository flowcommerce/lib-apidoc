import validateModel from '../../utilities/validate-model';
import isPrimative from '../../utilities/is-primative';
import validateType from '../../utilities/validate-apidoc-type';
import { genericError } from '../../utilities/validation-error';

// import validateStreets from './string';

// eslint-disable-next-line quotes,key-spacing,comma-spacing,max-len,quote-props,object-curly-spacing
const spec = {
  "name": "address",
  "plural": "addresses",
  "description": "Defines structured fields for address to be used in user/form input. Either text or the structured input needs to be present.",
  "deprecation": null,
  "fields": [
    {
      "name": "text",
      "type": "string",
      "description": "Full text version of address",
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    },
    {
      "name": "streets",
      "type": "[string]",
      "description": "Array for street line 1, street line 2, etc., in order",
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    },
    {
      "name": "city",
      "type": "string",
      "description": null,
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    },
    {
      "name": "province",
      "type": "string",
      "description": null,
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    },
    {
      "name": "postal",
      "type": "string",
      "description": null,
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    },
    {
      "name": "country",
      "type": "string",
      "description": "The ISO 3166-3 country code. Case insensitive. See https://api.flow.io/reference/countries",
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": "CAN",
      "attributes": []
    },
    {
      "name": "latitude",
      "type": "string",
      "description": null,
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    },
    {
      "name": "longitude",
      "type": "string",
      "description": null,
      "deprecation": null,
      "default": null,
      "required": false,
      "minimum": null,
      "maximum": null,
      "example": null,
      "attributes": []
    }
  ],
  "attributes": []
};

const validator = (field, value) => {
  if (value && isPrimative(field.type)) {
    return { [field.name]: validateType(field.type, value) };
  }

  if (value) {
    switch (field.type) {
    default:
      // eslint-disable-next-line prefer-template
      return { [field.name]: genericError(value, 'Unhandled field type[' + field.type + ']') };
    }
  }

  return { [field.name]: undefined };
};

const validate = validateModel(spec, validator);

export default validate;
