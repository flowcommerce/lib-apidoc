/* global describe, it */
import { expect } from 'chai';
import { getEnumDoc } from '../../src/docgen/enums';

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

    const expected = '<p>Some information about calendars</p>';
    const result = getEnumDoc(enumerator, docParts);

    expect(result.trim()).to.equal(expected.trim());
  });
});
