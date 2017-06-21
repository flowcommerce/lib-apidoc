import getBaseType from '../../../script/validations/utilities/get-base-type';

describe('getBaseType', () => {
  it('should get base type', () => {
    expect(getBaseType('string'), 'string').to.equal('string');
    expect(getBaseType('map[string]'), 'map[string]').to.equal('string');
    expect(getBaseType('[string]'), '[string]').to.equal('string');
    expect(getBaseType('[[string]]'), '[[string]]').to.equal('string');
  });
});
