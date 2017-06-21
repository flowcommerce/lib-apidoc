import reduce from 'lodash/fp/reduce';

const validatedFieldsToObject = (fields) =>
  reduce((field, obj) => ({ ...obj, ...field }), {}, fields);

export default validatedFieldsToObject;
