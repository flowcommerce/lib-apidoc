import validatedFieldsToObject from '../../../script/validations/utilities/validated-fields-to-object';

describe('validatedFieldsToObject', () => {
  it('should convert array of objects to an object', () => {
    const converted = validatedFieldsToObject([
      { field_1: 'value_1' },
      { field_2: 'value_2' },
      { field_3: 'value_3' },
    ]);

    expect(converted).to.deep.equal({
      field_1: 'value_1',
      field_2: 'value_2',
      field_3: 'value_3',
    });
  });
});
