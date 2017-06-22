import reduce from 'lodash/fp/reduce';

/**
 * Merge an array of objects that represent validated fields of an apidoc model.
 *
 * Example:
 * [
 *  { streets: [{ code: 'TYPE_MISMATCH_ERROR' ...}] },
 *  { city: { code: 'REQUIRED_FIELD_ERROR' ...} }
 * ]
 *
 * Output:
 * {
 *  streets: [{ code: 'TYPE_MISMATCH_ERROR' ...}],
 *  city: { code: 'REQUIRED_FIELD_ERROR' ...}
 * }
 */
const validatedFieldsToObject = (fields) =>
  reduce((field, obj) => ({ ...obj, ...field }), {}, fields);

export default validatedFieldsToObject;
