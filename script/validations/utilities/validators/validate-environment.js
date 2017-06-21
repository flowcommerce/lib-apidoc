import validateEnum from '../validate-enum';

const spec = {
  name: 'environment',
  plural: 'environments',
  description: null,
  deprecation: null,
  values: [
    {
      name: 'sandbox',
      description: 'In sandbox, no external services (e.g. orders, payments, logistics) will generate real transactions',
      deprecation: null,
      attributes: [],
    },
    {
      name: 'production',
      description: 'In production, all external services are live and will generate real transactions',
      deprecation: null,
      attributes: [],
    },
  ],
  attributes: [],
};

const validateEnvironment = validateEnum(spec);

export default validateEnvironment;
