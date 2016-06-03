/* global describe, it */
import { expect } from 'chai';
import EnumsGenerator from '../../src/docgen/enums';

describe('enums', () => {
  it('should get a enum doc', () => {
    const enumerator = {
      name: 'calendar',
    };
    const docParts = [
      {
        type: 'enum',
        name: 'calendar',
        content: '\nSome information about calendars\n\n',
      },
    ];
    const generator = new EnumsGenerator({}, docParts);
    const expected = '<p>Some information about calendars</p>';
    const result = generator.getEnumDoc(enumerator, docParts);

    expect(result.trim()).to.equal(expected.trim());
  });
});
