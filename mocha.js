import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';

process.env.NODE_ENV = 'test';
global.chai = chai;
global.expect = chai.expect;
global.nock = nock;

chai.use(chaiAsPromised);

// Disable real HTTP requests during tests.
nock.disableNetConnect();
