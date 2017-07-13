import validateArray from '../../../script/validations/utilities/validate-array';
import * as validationError from '../../../script/validations/utilities/validation-error';

describe('validateArray', () => {
  const validator = (value) => {
    if (typeof value === 'string') {
      return undefined;
    }

    return validationError.typeMismatchError(value, 'string');
  };

  it('should use validator to validate array', () => {
    const values = ['a', 'b', 'c'];
    const validated = validateArray(validator, values);

    expect(validated).to.deep.equal([undefined, undefined, undefined]);
  });

  it('should return type mismatch validation', () => {
    const values = ['a', 2, 'c'];
    const validated = validateArray(validator, values);

    expect(validated).to.deep.equal([
      undefined,
      {
        code: validationError.TYPE_MISMATCH_ERROR,
        value: 2,
        actual: 'number',
        expected: 'string',
      },
      undefined]);
  });
});
