import Experiences from '../dist/experiences';
import { expect } from 'chai';

describe('client', () => {
  function toBase64(str) {
    return new Buffer(str).toString('base64');
  }

  context('resource', () => {
    const client = new Experiences('https://localhost:7001');
    let requests = [];
    client.on('request', (data) => {
      requests = requests.concat(data);
    });

    it('should send a request', () => {
      client.get('someOrg');
      expect(requests).to.have.length(1);
      // eslint-disable-next-line no-unused-expressions
      expect(requests[0].url).to.equal('https://localhost:7001/someOrg/experiences');
    });
  });

  context('resource - with auth constructor', () => {
    const client = new Experiences({ host: 'https://localhost:7001', auth: 'basicAuth' });
    let requests = [];
    client.on('request', (data) => {
      requests = requests.concat(data);
    });

    it('should send a request', () => {
      client.get('someOrg');
      expect(requests).to.have.length(1);
      // eslint-disable-next-line no-unused-expressions
      expect(requests[0].url).to.equal('https://localhost:7001/someOrg/experiences');
    });

    it('should have ecoded auth header without using withAuth', () => {
      expect(client.auth).to.equal(`Basic ${toBase64('basicAuth')}`);
    });
  });
});
