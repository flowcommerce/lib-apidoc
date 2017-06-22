import { getBaseType, getArrayType } from '../../../script/validations/utilities/get-base-type';

describe('getBaseType', () => {
  context('getBaseType', () => {
    it('should get base type', () => {
      expect(getBaseType('string'), 'string').to.equal('string');
      expect(getBaseType('map[string]'), 'map[string]').to.equal('string');
      expect(getBaseType('[string]'), '[string]').to.equal('string');
      expect(getBaseType('[[string]]'), '[[string]]').to.equal('string');
    });
  });

  context('getArrayType', () => {
    it('should get array type', () => {
      expect(getArrayType('string'), 'string').to.equal('string');
      expect(getArrayType('[string]', '[string]')).to.equal('string');
      expect(getArrayType('[[string]]', '[[string]]')).to.equal('[string]');
    });
  });
});
