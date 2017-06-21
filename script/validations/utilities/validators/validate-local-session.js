import validateModel from '../validate-model';
import isPrimative from '../is-primative';
import validateType from '../validate-apidoc-type';

import { genericError } from '../validation-error';

const spec = {
  name: 'local_session',
  plural: 'local_sessions',
  description: 'If we found an experience for the given session, the localized information will be presented here',
  deprecation: null,
  fields: [
    {
      name: 'country',
      type: 'country',
      description: null,
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'currency',
      type: 'currency',
      description: null,
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'language',
      type: 'language',
      description: null,
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'locale',
      type: 'locale',
      description: null,
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'experience',
      type: 'experience_geo',
      description: null,
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
  ],
  attributes: [],
};

/**
 * Exists purely to limit the imports.
 */
const validator = (field, value) => {
  if (value && isPrimative(field.type)) {
    return { [field.name]: validateType(field.type, value) };
  }

  if (value) {
    switch (field.type) {
    case 'country':
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    case 'currency':
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    case 'language':
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    case 'locale':
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    case 'experience_geo':
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    default:
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    }
  }

  return { [field.name]: undefined };
};


const validateLocalSession = validateModel(spec, validator);

export default validateLocalSession;
