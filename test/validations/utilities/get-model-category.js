import getModelCategory from '../../../script/validations/utilities/get-model-category';

describe('getModelCategory', () => {
  const apiSpec = {
    enums: [
      {
        name: 'density',
        values: ['urban', 'suburban', 'rural'],
      },
    ],
    models: [
      {
        name: 'city',
      },
    ],
    unions: [
      {
        name: 'municipality',
        types: [
          { type: 'city' },
        ],
      },
    ],
  };

  it('should get the model category', () => {
    expect(getModelCategory('city', apiSpec), 'model').to.equal('model');
    expect(getModelCategory('density', apiSpec), 'enum').to.equal('enum');
    expect(getModelCategory('municipality', apiSpec), 'union').to.equal('union');
  });

  it('should throw on not found', () => {
    expect(() => {
      getModelCategory('unknown', apiSpec);
    }).to.throw('Could not determine api model category for type[unknown]');
  });
});
