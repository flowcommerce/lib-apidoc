import isPrimative from '../../../script/validations/utilities/is-primative';

describe('isPrimative', () => {
  it('should find all the apidoc primatives', () => {
    expect(isPrimative('boolean'), 'boolean').to.equal(true);
    expect(isPrimative('date-iso8601'), 'date-iso8601').to.equal(true);
    expect(isPrimative('date-time-iso8601'), 'date-time-iso8601').to.equal(true);
    expect(isPrimative('decimal'), 'decimal').to.equal(true);
    expect(isPrimative('double'), 'double').to.equal(true);
    expect(isPrimative('integer'), 'integer').to.equal(true);
    expect(isPrimative('long'), 'long').to.equal(true);
    expect(isPrimative('object'), 'object').to.equal(true);
    expect(isPrimative('string'), 'string').to.equal(true);
    expect(isPrimative('unit'), 'unit').to.equal(true);
    expect(isPrimative('uuid'), 'uuid').to.equal(true);
  });

  it('should return false', () => {
    expect(isPrimative('number'), 'number').to.equal(false);
  });
});
