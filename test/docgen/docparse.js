/* global describe, it */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  getType,
  isDocParse,
  getResource,
  getResourceOperation,
  getModel,
  getEnum,
  getDocPart,
  parseFile,
  parse } from '../../src/docgen/docparse';

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

  it('should get a resource operation', () => {
    const doc = '#doc:resource:operation GET /bookings/versions';
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
    const doc = '#doc:resource:operation GET /bookings/versions';
    const expected = {
      type: 'resource:operation',
      method: 'GET',
      path: '/bookings/versions',
    };
    expect(getDocPart(doc)).to.deep.equal(expected);
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
        content: '\nSome documentation about `/bookings`.\n\n',
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
        content: '\nSome documentation about addresses.\n\n',
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
});
