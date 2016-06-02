/* global describe, it */
import { expect } from 'chai';

import codegen from '../../src/codegen';
import fulfillmentService from './fulfillment.service.json';

describe('generate', () => {
  it('should return a package containing files', () => {
    const pack = codegen.generate(fulfillmentService);

    expect(pack).to.be.an('object');
    expect(pack.files).to.be.an('array');
    expect(pack.files).to.have.length.above(0);
    expect(pack.files[0]).to.be.an('object');
    expect(pack.files[0].path).to.be.a('string');
    expect(pack.files[0].contents).to.be.a('string');
  });

  it('should modify client import path', () => {
    const pack = codegen.generate(fulfillmentService, { clientImportPath: '../lib' });
    const filesWithClientImport = pack.files.filter((f) => f.contents.includes('../lib/client'));
    expect(filesWithClientImport).to.have.length.above(0);
  });
});
