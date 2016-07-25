/* global describe, it */
import 'babel-polyfill';
import { expect } from 'chai';
import * as utils from '../../src/docgen/utils';

describe('docgen: utils', () => {
  context('getCurlCommandFromOperation', () => {
    it('should return curl command for GET operations', () => {
      const operation = { method: 'get', path: '/resource' };
      const command = utils.getCurlCommandFromOperation(operation);
      expect(command).to.equal('curl -u &lt;api-token&gt;: https://api.flow.io/resource');
    });

    it('should return curl command for POST operations', () => {
      const operation = { method: 'post', path: '/resource' };
      const command = utils.getCurlCommandFromOperation(operation);
      expect(command).to.equal('curl -X POST -d @body.json -u &lt;api-token&gt;: https://api.flow.io/resource');
    });

    it('should return curl command for PUT operations', () => {
      const operation = { method: 'put', path: '/resource' };
      const command = utils.getCurlCommandFromOperation(operation);
      expect(command).to.equal('curl -X PUT -d @body.json -u &lt;api-token&gt;: https://api.flow.io/resource');
    });

    it('should return curl command for DELETE operations', () => {
      const operation = { method: 'delete', path: '/resource' };
      const command = utils.getCurlCommandFromOperation(operation);
      expect(command).to.equal('curl -X DELETE -d @body.json -u &lt;api-token&gt;: https://api.flow.io/resource');
    });
  });

  it('slug', () => {
    expect(utils.slug('some_text')).to.equal('some-text');
    expect(utils.slug('some text')).to.equal('some-text');
    expect(utils.slug('some-text')).to.equal('some-text');
    expect(utils.slug('some-_*MultipLe)*text')).to.equal('some-multiple-text');
    expect(utils.slug('some       text')).to.equal('some-text');
    expect(utils.slug('some    \n   text\n')).to.equal('some-text');
    expect(utils.slug('#$#$some    \n   text\n')).to.equal('some-text');
  });

  it('slugToLabel', () => {
    expect(utils.slugToLabel('#$#$some    \n   text\n')).to.equal('some text');
    expect(utils.slugToLabel('some-thing-with-lots-of-hypens')).to.equal('some thing with lots of hypens');
  });

  it('linkType', () => {
    expect(utils.linkType('')).to.equal('');
    expect(utils.linkType('string')).to.equal('<a href="types.html#type-string">string</a>');
    expect(utils.linkType('[string]')).to.equal('[<a href="types.html#type-string">string</a>]');
    expect(utils.linkType('[compound_type]'))
      .to.equal('[<a href="types.html#type-compound-type">compound_type</a>]');
  });

  it('getDocAttributeModule', () => {
    const attributes = [
      {
        name: 'docs',
        value: {
          module: 'localization',
        },
      },
    ];
    expect(utils.getDocAttributeModule(attributes)).to.equal('localization');
  });

  it('getDocAttributeModule - no module', () => {
    const attributes = [
      {
        name: 'docs',
        value: {
          other: 'thing',
        },
      },
    ];
    expect(utils.getDocAttributeModule(attributes)).to.equal(null);
  });

  it('getDocAttributeModule - no attributes', () => {
    expect(utils.getDocAttributeModule([])).to.equal(null);
    expect(utils.getDocAttributeModule()).to.equal(null);
  });

  it('getOrderedModules', () => {
    const resources = [
      {
        plural: 'catalogs',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'localization',
            },
          },
        ],
      },
      {
        plural: 'cards',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'payment',
            },
          },
        ],
      },
      {
        plural: 'organizations',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'general',
            },
          },
        ],
      },
    ];
    expect(utils.getOrderedModules(resources))
      .to.deep.equal(['localization', 'payment', 'general']);
  });

  it('getOrderedModules - dedupe', () => {
    const resources = [
      {
        plural: 'catalogs',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'localization',
            },
          },
        ],
      },
      {
        plural: 'users',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'general',
            },
          },
        ],
      },
      {
        plural: 'organizations',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'general',
            },
          },
        ],
      },
    ];
    expect(utils.getOrderedModules(resources))
      .to.deep.equal(['localization', 'general']);
  });

  it('getOrderedModules - error with bad module', () => {
    const resources = [
      {
        plural: 'catalogs',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'localization',
            },
          },
        ],
      },
      {
        plural: 'cards',
        attributes: [
          {
            name: 'docs',
            value: {
              no: 'broken',
            },
          },
        ],
      },
      {
        plural: 'organizations',
        attributes: [
          {
            name: 'docs',
            value: {
              module: 'general',
            },
          },
        ],
      },
    ];
    expect(() => utils.getOrderedModules(resources))
      .to.throw('Expected resource[cards]');
  });
});
