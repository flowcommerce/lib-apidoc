import Client from '../dist/client';
import Api from '../dist';

describe('client', () => {
  function toBase64(str) {
    return new Buffer(str).toString('base64');
  }

  it('should expose enums from service json', () => {
    const api = new Api({ host: 'https://localhost:7001' });
    expect(api.enums, 'api.enums').to.exist; // eslint-disable-line no-unused-expressions
    expect(api.enums.calendar, 'api.enums.caledar').to.exist; // eslint-disable-line no-unused-expressions,max-len
  });

  context('auth - core functionality', () => {
    const client = new Client({ host: 'https://localhost:7001' });
    let requests = [];
    client.on('request', (data) => {
      requests = requests.concat(data);
    });

    it('should not validate an auth wrong type', () => {
      expect(() =>
        Client.validateAuth({ type: 'foo', value: 'dfsf' })
      ).to.throw('Auth type must be one of: basic, bearer, jwt');
    });

    it('should not validate auth without type', () => {
      expect(() =>
        Client.validateAuth({ value: 'asdf', bar: 'asdfs' })
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should not validate auth without value', () => {
      expect(() =>
        Client.validateAuth({ type: 'basic', bar: 'sfff' })
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should not validate auth with none of the expected props', () => {
      expect(() =>
        Client.validateAuth({ foo: 'basic', bar: 'sfds' })
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should not validate auth with the wrong size', () => {
      expect(() =>
        Client.validateAuth({})
      ).to.throw(/Expected auth to be either a string or a valid auth object/);
    });

    it('should validate a basic auth string', () => {
      expect(() =>
        Client.validateAuth('some basic auth string')
      ).to.not.throw(Error);
    });

    it('should create encoded basic header value', () => {
      expect(Client.getBasicAuthHeaderValue('basicauth'))
        .to.equal(`Basic ${toBase64('basicauth')}`);
    });

    it('should create a header from a string', () => {
      expect(Client.possiblyConvertAuthorizationHeader('basicauth'))
        .to.equal(`Basic ${toBase64('basicauth')}`);
    });

    it('should create a basic header from an object', () => {
      expect(Client.possiblyConvertAuthorizationHeader({ type: 'basic', value: 'helloworld' }))
        .to.equal(`Basic ${toBase64('helloworld')}`);
    });

    it('should create a bearer header from an object (bearer type)', () => {
      expect(Client.possiblyConvertAuthorizationHeader({ type: 'bearer', value: 'jwttoken' }))
        .to.equal('Bearer jwttoken');
    });

    it('should create a bearer header from an object (jwt type)', () => {
      expect(Client.possiblyConvertAuthorizationHeader({ type: 'jwt', value: 'jwttoken' }))
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

    it('should not set any auth for undefined', () => {
      client.auth = void 0;
      const withAuth = client.withAuth();
      // eslint-disable-next-line no-unused-expressions
      expect(withAuth.auth).to.be.undefined;
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

    it('should not modify headers for undefined', () => {
      client.headers = void 0;
      const withHeaders = client.withHeaders();
      // eslint-disable-next-line no-unused-expressions
      expect(withHeaders.headers).to.be.undefined;
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

  context('makeRequest', () => {
    const client = new Client({ host: 'https://localhost:7001' });
    let requests = [];
    client.on('request', (data) => {
      requests = requests.concat(data);
    });

    it('should not reject on a 5xx from server', () => {
      nock('https://localhost:7001')
        .get('/make/request/internal_server_error')
        .reply(500);
      const response = client.makeRequest('https://localhost:7001/make/request/internal_server_error');

      return expect(response).to.eventually.deep.equal({ ok: false, result: '', status: 500 });
    });

    it('should not reject on a 4xx from server', () => {
      nock('https://localhost:7001')
        .get('/make/request/unprocessable_entity')
        .reply(422, { error: { messages: ['An error occurred'] } });
      const response = client.makeRequest('https://localhost:7001/make/request/unprocessable_entity');

      return expect(response).to.eventually.deep.equal({
        ok: false,
        result: { error: { messages: ['An error occurred'] } },
        status: 422,
      });
    });
  });
});
