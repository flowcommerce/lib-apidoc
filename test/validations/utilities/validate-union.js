import validateUnion from '../../../script/validations/utilities/validate-union';
import * as validationError from '../../../script/validations/utilities/validation-error';

describe('validateUnion', () => {
  const spec = {
    name: 'my_union',
    types: [
      { type: 'my_type_1' },
      { type: 'my_type_2' },
    ],
  };

  // Not real or valid validators. This file isn't testing them so basically
  // echo back a successful empty object.
  const validators = {
    my_type_1: value =>
      (typeof value === 'object' ? {} : validationError.typeMismatchError(value, 'object')),
    my_type_2: value =>
      (typeof value === 'object' ? {} : validationError.typeMismatchError(value, 'object')),
  };

  it('should validate a union', () => {
    const myTypeOne = {
      discriminator: 'my_type_1',
      field_1: 'hello',
    };
    expect(validateUnion(spec, validators, myTypeOne)).to.deep.equal({});
    expect(validateUnion(spec, validators, {})).to.deep.equal({
      code: validationError.FIELD_REQUIRED_ERROR,
      name: 'discriminator',
    });
    expect(validateUnion(spec, validators, { discriminator: 'not_valid' })).to.deep.equal({
      code: validationError.INVALID_UNION_DISCRIMINATOR_ERROR,
      value: 'not_valid',
      expected: ['my_type_1', 'my_type_2'],
    });
  });
});
