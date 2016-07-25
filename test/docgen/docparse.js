/* global describe, it */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  getType,
  isDocParse,
  getJsonExample,
  getResource,
  getResourceOperation,
  getModel,
  getEnum,
  getDocPart,
  parseFile,
  parse } from '../../src/docgen/docparse';
import { getMarkdownCodeBlock } from '../../src/docgen/utils';

describe('docparse', () => {
  it('should detect doc parse lines', () => {
    expect(isDocParse('#doc:resource bookings')).to.be.true;
    expect(isDocParse('#doc:resource:operation GET /bookings/versions')).to.be.true;
    expect(isDocParse('- bullet point')).to.not.be.true;
    expect(isDocParse('paragraph text')).to.not.be.true;
    expect(isDocParse('')).to.not.be.true;
  });

  it('should get types', () => {
    expect(getType('#doc:resource bookings'))
      .to.equal('resource');

    expect(getType('#doc:resource:operation GET /bookings/versions'))
      .to.equal('resource:operation');

    expect(getType('#doc:model booking_version'))
      .to.equal('model');

    expect(getType('#doc:enum capability'))
      .to.equal('enum');
  });

  it('should fail to get type', () => {
    expect(() => getType('foo')).to.throw('Not a DocParse Statement');
  });

  it('should get a resource operation', () => {
    const doc = '#doc:resource:operation GET /bookings/versions\n\nMore stuff';
    const expected = {
      type: 'resource:operation',
      method: 'GET',
      path: '/bookings/versions',
    };

    expect(getResourceOperation(doc)).to.deep.equal(expected);
  });

  it('should get a resource', () => {
    const doc = '#doc:resource bookings';
    const expected = {
      type: 'resource',
      name: 'bookings',
    };

    expect(getResource(doc)).to.deep.equal(expected);
  });

  it('should get a model', () => {
    const doc = '#doc:model address';
    const expected = {
      type: 'model',
      name: 'address',
    };

    expect(getModel(doc)).to.deep.equal(expected);
  });

  it('should get an emum', () => {
    const doc = '#doc:enum calendar';
    const expected = {
      type: 'enum',
      name: 'calendar',
    };

    expect(getEnum(doc)).to.deep.equal(expected);
  });

  it('should get arbitrary doc part', () => {
    const docExpected = (doc, expected) =>
      expect(getDocPart(doc)).to.deep.equal(expected);

    docExpected(
      '#doc:resource:operation GET /bookings/versions',
      {
        type: 'resource:operation',
        method: 'GET',
        path: '/bookings/versions',
      }
    );
    docExpected('#doc:resource bookings', { type: 'resource', name: 'bookings' });
    docExpected('#doc:model car', { type: 'model', name: 'car' });
    docExpected('#doc:enum sizes', { type: 'enum', name: 'sizes' });
  });

  it('should fail with unkown type', () => {
    const doc = '#doc:foo GET /bookings/versions';
    expect(() => getDocPart(doc)).to.throw(/Type not found: foo/);
  });

  it('should parse a files contents', () => {
    const content = `
#doc:resource:operation GET /bookings/versions

Some documentation about \`/bookings/version\`.

#doc:resource:operation GET /bookings

- one`;
    const expected = [
      {
        type: 'resource:operation',
        method: 'GET',
        path: '/bookings/versions',
        content: '\nSome documentation about `/bookings/version`.\n\n',
      },
      {
        type: 'resource:operation',
        method: 'GET',
        path: '/bookings',
        content: '\n- one\n',
      },
    ];
    const result = parseFile(content);
    expect(result).to.deep.equal(expected);
  });

  it('should fail parseFile with specific line number', () => {
    const content = `
#doc:resource:operation GET /bookings/versions

Some documentation about \`/bookings/version\`.

#doc:foo GET /bookings

- one`;
    expect(() => parseFile(content.trim(), { fileName: 'foo.md' })).to.throw(/line 5/);
    expect(() => parseFile(content.trim(), { fileName: 'foo.md' })).to.throw('foo.md');
  });

  it('should parse a glob of files', (done) => {
    const resultPromise = parse('test/docgen/doc/*.md');
    const expected = [
      {
        content: '\nSome documentation about `/bookings/versions`.\n\nHere are some bullet points\n\n- one\n- two\n- three\n\n', // eslint-disable-line max-len
        method: 'GET',
        path: '/bookings/versions',
        type: 'resource:operation',
      },
      {
        content: '\nSome documentation about `/bookings`.\n\n\n',
        method: 'GET',
        path: '/bookings',
        type: 'resource:operation',
      },
      {
        content: '\nSome documentation about bookings in general.\n\n\n',
        name: 'bookings',
        type: 'resource',
      },
      {
        content: '\nSome documentation about addresses.\n\n\n',
        name: 'address',
        type: 'model',
      },
    ];

    resultPromise.then((result) => {
      expect(result).to.deep.equal(expected);
      done();
    })
    .catch((err) => done(err));
  });

  context('example json', () => {
    it('should parse a json example', () => {
      const doc = '#doc:json:example items/post/:organization/catalog/items/simple';
      const curlBlock = getMarkdownCodeBlock(
        'curl -X POST -d @body.json -u <api-token>: https://api.flow.io/:organization/catalog/items',
        'Bash'
      );
      const bodyBlock = getMarkdownCodeBlock(`
{
  "number": "sku-1",
  "name": "3-Tier Ceramic Hanging Planter",
  "locale": "en_US",
  "price": 150.00,
  "currency": "USD"
}`, 'JSON');
      const responseBlock = getMarkdownCodeBlock(`
{
  "id": "cit-20160725-1984376339",
  "number": "sku-1",
  "locale": "en_US",
  "name": "3-Tier Ceramic Hanging Planter",
  "price": {
    "amount": 150,
    "currency": "USD",
    "label": "USD 150.0"
  },
  "categories": [],
  "attributes": [],
  "dimensions": [],
  "images": []
}
      `, 'JSON');

      expect(getJsonExample(doc).trim()).to.deep.equal(`
${curlBlock}
body.json
${bodyBlock}

API Respone
${responseBlock}`.trim());
    });

    it('should parse a json example with only a response', () => {
      const doc = '#doc:json:example items/delete/:organization/catalog/items/:number/simple';
      const curlBlock = getMarkdownCodeBlock(
        'curl -X DELETE -d @body.json -u <api-token>: https://api.flow.io/:organization/catalog/items/:number',
        'Bash'
      );
      const responseBlock = getMarkdownCodeBlock('\n', 'JSON');

      expect(getJsonExample(doc).trim()).to.deep.equal(`
${curlBlock}

API Respone
${responseBlock}`.trim());
    });

    it('should throw an error with no request or response present', () => {
      const doc = '#doc:json:example experiences/post/:organization/experiences/simple';
      expect(() => getJsonExample(doc)).to.throw(/Could not find request or response json/);
    });
  });
});
