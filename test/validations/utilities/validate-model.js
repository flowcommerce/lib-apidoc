import validateModel from '../../../script/validations/utilities/validate-model';
import isPrimative from '../../../script/validations/utilities/is-primative';
import validateType from '../../../script/validations/utilities/validate-apidoc-type';
import * as validationError from '../../../script/validations/utilities/validation-error';

describe('validateModel', () => {
  const spec = {
    name: 'my_model',
    fields: [
      { name: 'field_1', type: 'string', required: true },
      { name: 'field_2', type: 'long', required: true },
    ],
  };
  const validator = (field, value) => {
    if (value && isPrimative(field.type)) {
      return { [field.name]: validateType(field.type, value) };
    }

    return { [field.name]: undefined };
  };

  it('should validate a model', () => {
    const successModel = {
      field_1: 'hello',
      field_2: 1283484844,
    };

    const errorModel = {
      field_2: 'world',
    };

    expect(validateModel(spec, validator, successModel)).to.deep.equal({});
    expect(validateModel(spec, validator, 'not_an_object')).to.deep.equal({
      code: validationError.TYPE_MISMATCH_ERROR,
      value: 'not_an_object',
      actual: 'string',
      expected: 'object',
    });
    expect(validateModel(spec, validator, errorModel)).to.deep.equal({
      field_1: {
        code: validationError.FIELD_REQUIRED_ERROR,
        name: 'field_1',
      },
      field_2: {
        code: validationError.TYPE_MISMATCH_ERROR,
        value: 'world',
        actual: 'string',
        expected: 'number',
      },
    });
  });
});
