/* global describe, it */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import ResourceGenerator from '../../src/docgen/resources';
import { expectHtmlEqual } from '../util';

const testService = {
  models: [
    {
      name: 'car',
    },
    {
      name: 'car_with_fields',
      fields: [
        { name: 'year', type: 'integer', minimum: 4, maximum: 4 },
        { name: 'make', type: 'string' },
        { name: 'model', type: 'string' },
      ],
    },
    {
      name: 'country',
    },
  ],
  enums: [],
  unions: [],
};

describe('resources', () => {
  it('operationSlug', () => {
    const operation = {
      method: 'GET',
      path: '/:organization/bookings/versions',
    };
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.operationSlug(operation)).to.equal('get-organization-bookings-versions');
  });

  it('getModelByType', () => {
    const generator = new ResourceGenerator(testService, {}, []);
    const expected = {
      name: 'car',
    };
    expect(generator.getModelByType('car')).to.deep.equal(expected);
  });

  it('getModelByType - not found', () => {
    const generator = new ResourceGenerator(testService, {}, []);
    expect(generator.getModelByType('foo')).to.be.undefined;
  });

  it('parameterMaximum', () => {
    const parameter = {
      maximum: 10,
    };
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.parameterMaximum(parameter))
      .to.equal('<span class="block">Maximum: 10</span>');
  });

  it('parameterMaximum - undefined', () => {
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.parameterMaximum({}))
      .to.equal('');
  });

  it('parameterMinimum', () => {
    const parameter = {
      minimum: 0,
    };
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.parameterMinimum(parameter))
      .to.equal('<span class="block">Minimum: 0</span>');
  });

  it('parameterMinimum - undefined', () => {
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.parameterMinimum({}))
      .to.equal('');
  });

  it('parameterExample', () => {
    const parameter = {
      example: 'hello',
    };
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.parameterExample(parameter))
      .to.equal('<span class="block">Example: hello</span>');
  });

  it('parameterExample - undefined', () => {
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.parameterExample({}))
      .to.equal('');
  });

  it('paramaterDescription', () => {
    const parameter = {
      description: 'about the parameter',
    };
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.paramaterDescription(parameter))
      .to.equal('about the parameter');
  });

  it('paramaterDescription - undefined', () => {
    const generator = new ResourceGenerator({}, {}, []);
    expect(generator.paramaterDescription({}))
      .to.equal('');
  });

  it('parameterDefault', () => {
    const generator = new ResourceGenerator({}, {}, []);
    const expected = `<span class="parameter-default block">
      default: <strong>YELLOW</strong>
    </span>`;

    expectHtmlEqual(generator.parameterDefault({ default: 'YELLOW' }), expected);
  });

  it('parameterDefault - undefined', () => {
    const generator = new ResourceGenerator({}, {}, []);
    expectHtmlEqual(generator.parameterDefault({}), '');
  });

  it('optionalRequired - required', () => {
    const generator = new ResourceGenerator({}, {}, []);
    expectHtmlEqual(generator.optionalRequired({ required: true }), '');
  });

  it('optionalRequired - optional', () => {
    const generator = new ResourceGenerator({}, {}, []);
    const expected = '<span class="parameter-optional block">optional</span>';
    expectHtmlEqual(generator.optionalRequired({}), expected);
  });

  it('generateParameter', () => {
    const generator = new ResourceGenerator(testService, {}, []);
    const parameter = {
      name: 'country',
      type: 'country',
      default: 'USA',
      description: 'Three letter ISO code',
      example: 'USA',
      minimum: 3,
      maximum: 3,
    };
    const expected = `
      <div class="flex my2 table-row">
        <div class="parameter col-2 mr3 right-align">
          <span class="parameter-name block">country</span>
          <span class="parameter-optional block">optional</span>
          <span class="parameter-default block"> default: <strong>USA</strong> </span>
        </div>
        <div class="parameter-type col-2 mr3"><a href="types.html#type-country">country</a></div>
        <div class="parameter-desc col-8">
          Three letter ISO code
          <span class="block">Example: USA</span>
          <span class="block">Minimum: 3</span>
          <span class="block">Maximum: 3</span>
        </div>
      </div>`;
    expectHtmlEqual(generator.generateParameter(parameter), expected);
  });

  it('operationDescription', () => {
    const operation = { description: 'operation description' };
    const generator = new ResourceGenerator({}, {}, []);
    const expected = '<p class="operation-desc">operation description</p>';
    expectHtmlEqual(generator.operationDescription(operation), expected);
  });

  it('generateResponse', () => {
    const response = {
      code: {
        integer: {
          value: 200,
        },
      },
      type: 'car',
      description: 'response description',
    };
    const generator = new ResourceGenerator(testService, {}, []);
    const expected = `
      <div class="flex my2 table-row">
        <div class="parameter col-2 mr3 right-align">200</div>
        <div class="parameter-type col-2 mr3"><a href="types.html#type-car">car</a></div>
        <div class="parameter-type col-8 mr3">response description</div>
      </div>
    `;
    expectHtmlEqual(generator.generateResponse(response), expected);
  });

  it('getResourceDoc', () => {
    const resource = {
      plural: 'bookings',
    };
    const docParts = [
      {
        type: 'resource',
        name: 'bookings',
        content: '\nSome information about bookings\n\n',
      },
    ];

    const generator = new ResourceGenerator({}, resource, docParts);
    const expected = `
      <header class="md-content">
        <p>Some information about bookings</p>
      </header>`;
    const result = generator.getResourceDoc(resource, docParts);

    expectHtmlEqual(result, expected);
  });

  it('getResourceOperationDoc', () => {
    const operation = {
      method: 'GET',
      path: '/bookings/version',
    };
    const resource = {
      operations: [operation],
    };
    const content = `
Some documentation about \`/bookings/version\`.

  Here are some bullet points

  - one
  - two
  - three`;
    const docParts = [
      {
        type: 'resource:operation',
        path: '/bookings/version',
        method: 'GET',
        content,
      },
    ];
    const expected = `
      <div class="md-content">
        <p>Some documentation about <code>/bookings/version</code>.</p>
        <p> Here are some bullet points</p>
        <ul>
          <li>one</li>
          <li>two</li>
          <li>three</li>
        </ul>
      </div>`;
    const generator = new ResourceGenerator({}, resource, docParts);
    const result = generator.getResourceOperationDoc(operation, docParts);
    expectHtmlEqual(result, expected);
  });

  it('generateOperationBody - model w/o fields', () => {
    const operation = {
      body: {
        type: 'car',
      },
      fields: [
        { name: 'manufacturer', type: 'string' },
      ],
    };
    const generator = new ResourceGenerator(testService, {}, []);
    const expected = `
    <section class="body">
      <h3 class="h3">Body</h3>
      <p>This operation accepts a body of type <a href="types.html#type-car">car</a>.</p>
    </section>`;
    const result = generator.generateOperationBody(operation);
    expectHtmlEqual(result, expected);
  });

  it('generateOperationBody - model w/ fields', () => {
    const operation = {
      body: {
        type: 'car_with_fields',
      },
    };
    const generator = new ResourceGenerator(testService, {}, []);
    const expected = `
    <section class="body">
      <h3 class="h3">Body</h3>
      <p>This operation accepts a body of type
        <a href="types.html#type-car-with-fields">car_with_fields</a>.</p>
      <div class="flex my2 table-row">
        <div class="parameter table-header col-2 mr3 right-align">Name</div>
        <div class="parameter-type table-header col-2 mr3">Type</div>
        <div class="parameter-desc table-header col-8">Description</div>
      </div>
      <div class="flex my2 table-row">
        <div class="field col-2 mr3 right-align">
          <span class="field-name block">year</span>
          <span class="field-optional block">optional</span>
        </div>
        <div class="field-type col-2 mr3">integer</div>
        <div class="field-desc col-8">
          <span class="block">Minimum: 4</span>
          <span class="block">Maximum: 4</span>
        </div>
      </div>
      <div class="flex my2 table-row">
        <div class="field col-2 mr3 right-align">
          <span class="field-name block">make</span>
          <span class="field-optional block">optional</span>
        </div>
        <div class="field-type col-2 mr3">string</div>
        <div class="field-desc col-8"> </div>
      </div>
      <div class="flex my2 table-row">
        <div class="field col-2 mr3 right-align">
          <span class="field-name block">model</span>
          <span class="field-optional block">optional</span>
        </div>
        <div class="field-type col-2 mr3">string</div>
        <div class="field-desc col-8"> </div>
      </div>
    </section>`;
    const result = generator.generateOperationBody(operation);
    expectHtmlEqual(result, expected);
  });
});
