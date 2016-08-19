import Client from '../dist/client';
import { expect } from 'chai';

describe('client', () => {
  function toBase64(str) {
    return new Buffer(str).toString('base64');
  }

  context('auth - core functionality', () => {
    const client = new Client({ host: 'https://localhost:7001' });
    let requests = [];
    client.on('request', (data) => {
      requests = requests.concat(data);
    });

    it('should not validate an auth wrong type', () => {
      expect(() =>
        client.validateAuth({ type: 'foo', value: 'dfsf' })
      ).to.throw('Auth type must be one of: basic, bearer, jwt');
    });

    it('should not validate auth without type', () => {
      expect(() =>
        client.validateAuth({ value: 'asdf', bar: 'asdfs' })
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should not validate auth without value', () => {
      expect(() =>
        client.validateAuth({ type: 'basic', bar: 'sfff' })
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should not validate auth with none of the expected props', () => {
      expect(() =>
        client.validateAuth({ foo: 'basic', bar: 'sfds' })
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should not validate auth with the wrong size', () => {
      expect(() =>
        client.validateAuth({})
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should validate a basic auth string', () => {
      expect(() =>
        client.validateAuth('some basic auth string')
      ).to.not.throw(Error);
    });

    it('should create encoded basic header value', () => {
      expect(client.getBasicAuthHeaderValue('basicauth'))
        .to.equal(`Basic ${toBase64('basicauth')}`);
    });

    it('should create a header from a string', () => {
      expect(client.possiblyConvertAuthorizationHeader('basicauth'))
        .to.equal(`Basic ${toBase64('basicauth')}`);
    });

    it('should create a basic header from an object', () => {
      expect(client.possiblyConvertAuthorizationHeader({ type: 'basic', value: 'helloworld' }))
        .to.equal(`Basic ${toBase64('helloworld')}`);
    });

    it('should create a bearer header from an object (bearer type)', () => {
      expect(client.possiblyConvertAuthorizationHeader({ type: 'bearer', value: 'jwttoken' }))
        .to.equal('Bearer jwttoken');
    });

    it('should create a bearer header from an object (jwt type)', () => {
      expect(client.possiblyConvertAuthorizationHeader({ type: 'jwt', value: 'jwttoken' }))
        .to.equal('Bearer jwttoken');
    });

    it('should return instance with auth', () => {
      const withAuth = client.withAuth('basic');
      expect(withAuth.auth).to.equal(`Basic ${toBase64('basic')}`);
    });

    it('should set the auth header upon request', () => {
      client.withAuth('someAuth').makeRequest('/test');
      expect(requests).to.have.length(1);
      // eslint-disable-next-line no-unused-expressions
      expect(requests[0].headers.Authorization).to.exist;
      expect(requests[0].headers.Authorization).to.equal('Basic c29tZUF1dGg=');
    });
  });

  context('auth - passed to constructor', () => {
    const client = new Client({ auth: 'constructorAuth' });

    it('should have converted auth header', () => {
      expect(client.auth).to.equal(`Basic ${toBase64('constructorAuth')}`);
    });
  });

  context('headers - withHeaders', () => {
    const client = new Client();

    it('should not have any headers', () => {
      expect(client.headers).to.deep.equal({});
    });

    it('should add to headers', () => {
      const newHeader = { new: 'header' };
      const updatedClient = client.withHeaders(newHeader);
      expect(updatedClient.headers).to.deep.equal(newHeader);
    });
  });

  context('headers - from constructor', () => {
    const original = { original: 'headers' };
    const client = new Client({ headers: original });

    it('should have original headers', () => {
      expect(client.headers).to.deep.equal(original);
    });

    it('should add to headers', () => {
      const newHeader = { new: 'header' };
      const updatedClient = client.withHeaders(newHeader);
      const expected = Object.assign({}, original, newHeader);
      expect(updatedClient.headers).to.deep.equal(expected);
    });
  });
});
