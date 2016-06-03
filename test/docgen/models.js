/* global describe, it */
import { expect } from 'chai';
import { ModelsGenerator } from '../../src/docgen/models';

describe('models', () => {
  it('should get a model doc', () => {
    const model = {
      name: 'address',
    };
    const docParts = [
      {
        type: 'model',
        name: 'address',
        content: '\nSome information about addresses\n\n',
      },
    ];
    const generator = new ModelsGenerator({}, docParts);
    const expected = '<p>Some information about addresses</p>';
    const result = generator.getModelDoc(model, docParts);

    expect(result.trim()).to.equal(expected.trim());
  });
});
