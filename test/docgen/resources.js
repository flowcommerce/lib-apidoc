/* global describe, it */
import { expect } from 'chai';
import { getResourceDoc, getResourceOperationDoc } from '../../src/docgen/resources';

describe('resources', () => {
  it('should get a resource doc', () => {
    const resource = {
      plural: 'bookings',
    };
    const docParts = [
      {
        type: 'resource',
        name: 'bookings',
        content: '\nSome information about bookings\n\n',
      },
    ];

    const expected = '<p>Some information about bookings</p>';
    const result = getResourceDoc(resource, docParts);

    expect(result.trim()).to.equal(expected.trim());
  });

  it('should get a resource operation doc', () => {
    const operation = {
      method: 'GET',
      path: '/bookings/version',
    };

    const content = `Some documentation about \`/bookings/version\`.

Here are some bullet points

- one
- two
- three`;
    const docParts = [
      {
        type: 'resource:operation',
        path: '/bookings/version',
        method: 'GET',
        content,
      },
    ];
    const expected = `<p>Some documentation about <code>/bookings/version</code>.</p>
<p>Here are some bullet points</p>
<ul>
<li>one</li>
<li>two</li>
<li>three</li>
</ul>`;

    const result = getResourceOperationDoc(operation, docParts);

    expect(result.trim()).to.equal(expected.trim());
  });
});
