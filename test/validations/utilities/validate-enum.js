import validateEnum from '../../../script/validations/utilities/validate-enum';
import * as validationError from '../../../script/validations/utilities/validation-error';

describe('validateEnum', () => {
  const spec = {
    name: 'my_enum',
    values: [
      { name: 'value_1' },
      { name: 'value_2' },
    ],
  };

  it('validate enum values', () => {
    expect(validateEnum(spec, 'value_1')).to.equal(undefined);
    expect(validateEnum(spec, 282)).to.deep.equal({
      code: validationError.TYPE_MISMATCH_ERROR,
      value: 282,
      actual: 'number',
      expected: 'string',
    });
    expect(validateEnum(spec, 'not_a_value')).to.deep.equal({
      code: validationError.INVALID_ENUM_VALUE_ERROR,
      value: 'not_a_value',
      expected: ['value_1', 'value_2'],
    });
  });
});
