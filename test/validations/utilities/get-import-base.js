import getImportBase from '../../../script/validations/utilities/get-import-base';

describe('getImportBase', () => {
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

  it('should get import base', () => {
    expect(getImportBase('model', 'city', apiSpec), 'model -> model').to.equal('.');
    expect(getImportBase('model', 'municipality', apiSpec), 'model -> union')
      .to.equal('../unions');
  });
});
