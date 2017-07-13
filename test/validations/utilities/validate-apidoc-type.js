import validateType from '../../../script/validations/utilities/validate-apidoc-type';
import * as ErrorConstants from '../../../script/validations/utilities/validation-error';

describe('validateApidocType', () => {
  it('boolean', () => {
    // no validation errors
    expect(validateType('boolean', true)).to.equal(undefined);

    // validation error
    expect(validateType('boolean', 'hello world')).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: 'hello world',
      actual: 'string',
      expected: 'boolean',
    });
  });

  it('date-iso8601', () => {
    expect(validateType('date-iso8601', '2017-06-21')).to.equal(undefined);
    expect(validateType('date-iso8601', 12978123172)).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: 12978123172,
      actual: 'number',
      expected: 'string',
    });
    expect(validateType('date-iso8601', 'hello world')).to.deep.equal({
      code: ErrorConstants.INVALID_VALUE_FORMAT,
      value: 'hello world',
      format: '2014-04-29',
    });
  });

  it('date-time-iso8601', () => {
    expect(validateType('date-time-iso8601', '2017-06-21T16:29:52-04')).to.equal(undefined);
    expect(validateType('date-time-iso8601', 1231267312)).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: 1231267312,
      actual: 'number',
      expected: 'string',
    });
    expect(validateType('date-time-iso8601', 'hello world')).to.deep.equal({
      code: ErrorConstants.INVALID_VALUE_FORMAT,
      value: 'hello world',
      format: '2014-04-29T11:56:52Z',
    });
  });

  it('decimal', () => {
    expect(validateType('decimal', 12.34)).to.equal(undefined);
    expect(validateType('decimal', {})).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: {},
      actual: 'object',
      expected: 'number',
    });
  });

  it('double', () => {
    expect(validateType('double', 12.34)).to.equal(undefined);
    expect(validateType('double', {})).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: {},
      actual: 'object',
      expected: 'number',
    });
  });

  it('integer', () => {
    expect(validateType('integer', 12)).to.equal(undefined);
    expect(validateType('integer', {})).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: {},
      actual: 'object',
      expected: 'number',
    });
    expect(validateType('integer', 12.23)).to.deep.equal({
      code: ErrorConstants.INVALID_VALUE_FORMAT,
      value: 12.23,
      format: 'nn',
      expected: 'integer',
    });
  });

  it('long', () => {
    expect(validateType('long', 16297129129)).to.equal(undefined);
    expect(validateType('long', {})).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: {},
      actual: 'object',
      expected: 'number',
    });
    expect(validateType('long', 12334.2333432)).to.deep.equal({
      code: ErrorConstants.INVALID_VALUE_FORMAT,
      value: 12334.2333432,
      format: 'nnn',
      expected: 'long',
    });
  });

  it('object', () => {
    expect(validateType('object', {})).to.equal(undefined);
    expect(validateType('object', 'not object')).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: 'not object',
      actual: 'string',
      expected: 'object',
    });
  });

  it('unit', () => {
    expect(validateType('unit', null)).to.equal(undefined);
    expect(validateType('unit', 'not object')).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: 'not object',
      actual: 'string',
      expected: 'undefined',
    });
  });

  it('uuid', () => {
    expect(validateType('uuid', 'c09a4f15-330c-4b0c-817b-ba42bf692101')).to.equal(undefined);
    expect(validateType('uuid', {})).to.deep.equal({
      code: ErrorConstants.TYPE_MISMATCH_ERROR,
      value: {},
      actual: 'object',
      expected: 'string',
    });
    expect(validateType('uuid', 'hello world')).to.deep.equal({
      code: ErrorConstants.INVALID_VALUE_FORMAT,
      value: 'hello world',
      format: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      expected: 'uuid',
    });
  });

  it('map', () => {
    expect(validateType('map[string]', { hello: 'world' })).to.deep.equal({ hello: undefined });
    expect(validateType('map[string]', { hello: 12323 })).to.deep.equal({
      hello: {
        code: ErrorConstants.TYPE_MISMATCH_ERROR,
        value: 12323,
        actual: 'number',
        expected: 'string',
      },
    });
  });

  it('array', () => {
    expect(validateType('[string]', [])).to.deep.equal([]);
    expect(validateType('[string]', ['hello'])).to.deep.equal([undefined]);
    expect(validateType('[string]', ['world', 123])).to.deep.equal([
      undefined,
      {
        code: ErrorConstants.TYPE_MISMATCH_ERROR,
        value: 123,
        actual: 'number',
        expected: 'string',
      },
    ]);
    expect(validateType('[[string]]', [['str'], ['world', 123]])).to.deep.equal([
      [undefined],
      [
        undefined,
        {
          code: ErrorConstants.TYPE_MISMATCH_ERROR,
          value: 123,
          actual: 'number',
          expected: 'string',
        },
      ],
    ]);
  });
});
