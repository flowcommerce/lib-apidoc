/* global describe, it */
import { expect } from 'chai';
import { getOperationDoc } from '../../src/docgen/resources';

describe('resource', () => {
  it('should get a resource doc', () => {
    const operation = {
      method: 'GET',
      path: '/bookings/version',
    };

    const content = `
Some documentation about \`/bookings/version\`.

Here are some bullet points

- one
- two
- three
    `;
    const docParts = [
      {
        path: '/bookings/version',
        method: 'GET',
        content,
      },
    ];
    const expected = `
      <p>Some documentation about <code>/bookings/version</code>.</p>
<p>Here are some bullet points</p>
<ul>
<li>one</li>
<li>two</li>
<li>three</li>
</ul>

    `;

    const result = getOperationDoc(operation, docParts);

    expect(result).to.equal(expected);
  });
});
