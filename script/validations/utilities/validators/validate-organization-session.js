import validateModel from '../validate-model';
import isPrimative from '../is-primative';
import validateType from '../validate-apidoc-type';
import validateEnvironment from './validate-environment';
import validateLocalSession from './validate-local-session';

import { genericError } from '../validation-error';

const spec = {
  name: 'organization_session',
  plural: 'organization_sessions',
  description: null,
  deprecation: null,
  fields: [
    {
      name: 'id',
      type: 'string',
      description: 'Globally unique identifier',
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'organization',
      type: 'string',
      description: 'Refers to your organization\'s account identifier',
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'environment',
      type: 'environment',
      description: 'The Flow organization environment',
      deprecation: null,
      default: null,
      required: true,
      minimum: null,
      maximum: null,
      example: 'sandbox',
      attributes: [],
    },
    {
      name: 'attributes',
      type: 'map[string]',
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
      name: 'ip',
      type: 'string',
      description: 'The latest IP Address associated with this session, if known',
      deprecation: null,
      default: null,
      required: false,
      minimum: null,
      maximum: null,
      example: null,
      attributes: [],
    },
    {
      name: 'local',
      type: 'local_session',
      description: null,
      deprecation: null,
      default: null,
      required: false,
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
    case 'environment':
      return { [field.name]: validateEnvironment(value) };
    case 'local_session':
      return { [field.name]: validateLocalSession(value) };
    default:
      return { [field.name]: genericError(value, `Unhandled field type[${field.type}]`) };
    }
  }

  return { [field.name]: undefined };
};

const validateOrganizationSession = validateModel(spec, validator);

export default validateOrganizationSession;
