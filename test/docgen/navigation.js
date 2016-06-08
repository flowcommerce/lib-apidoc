/* global describe, it */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import NavigationGenerator from '../../src/docgen/navigation';
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
  resources: [
    {
      type: 'car',
      plural: 'cars',
      operations: [
        {
          method: 'GET',
          path: '/cars/versions',
          parameters: [
            { name: 'id', type: '[string]', required: false, maximum: 100 },
          ],
          responses: [
            { code: { integer: { value: 200 } }, type: '[booking_version]' },
          ],
        },
      ],
      attributes: [
        {
          name: 'docs',
          value: {
            module: 'automotive',
          },
        },
      ],
    },
  ],
};

describe('navigation', () => {
  it('getGroupName', () => {
    const generator = new NavigationGenerator(testService);
    const result = generator.getGroupName(0);
    const expected = 'automotive';
    expect(expected).to.equal(result);
  });

  it('resourceGroup', () => {
    const resources = [
      { type: 'car', plural: 'cars' },
      { type: 'factory', plural: 'factories' },
      { type: 'airport', plural: 'airports' },
    ];
    const generator = new NavigationGenerator(testService);
    const result = generator.resourceGroup(resources, 'foo');
    const expected = `
      <header>
        <h3 class="h3"><a href="index.html#foo">foo</a></h3>
      </header>
      <ul>
        <li> <a href="cars.html">cars</a> </li>
        <li> <a href="factories.html">factories</a> </li>
        <li> <a href="airports.html">airports</a> </li>
      </ul>`;

    expectHtmlEqual(expected, result);
  });

  it('getMappedResources', () => {
    const generator = new NavigationGenerator(testService);
    const result = generator.getMappedResources();
    const expected = {
      automotive: [
        {
          attributes: [{ name: 'docs', value: { module: 'automotive' } }],
          operations: [
            {
              method: 'GET',
              parameters: [
                { maximum: 100, name: 'id', required: false, type: '[string]' },
              ],
              path: '/cars/versions',
              responses: [
                { code: { integer: { value: 200 } }, type: '[booking_version]' },
              ],
            },
          ],
          plural: 'cars',
          type: 'car',
        },
      ],
    };
    expect(expected).to.deep.equal(result);
  });

  it('generateResources', () => {
    const generator = new NavigationGenerator(testService);
    const result = generator.generateResources();
    const expected = `
      <section class="resources">
        <header>
          <h3 class="h3"><a href="index.html#automotive">automotive</a></h3> </header>
        <ul>
          <li> <a href="cars.html">cars</a> </li>
        </ul>
      </section>`;
    expectHtmlEqual(expected, result);
  });

  it('generate', () => {
    const generator = new NavigationGenerator(testService);
    const result = generator.generate();
    const expected = `
      <nav class="left-navigation">
        <header class="header">
          <a href="index.html"> <img class="logo" src="/assets/0.0.1/img/flow_logo.svg" /> </a>
          <section class="title">API Reference</section>
          <p class="version">Version: undefined</p>
        </header>
        <header>
          <h3 class="h3"><a href="index.html#api">Getting Started</a></h3> </header>
        <ul>
          <li><a href="index.html#register-with-flow-commerce">Register</a></li>
          <li><a href="index.html#obtain-your-api-key">API Key</a></li>
          <li><a href="index.html#how-to-authenticate">Authentication</a></li>
          <li><a href="index.html#native-libraries">Libraries</a></li>
          <li><a href="index.html#getting-help">Getting Help</a></li>
          <li><a href="index.html#next-steps">Next Steps</a></li>
          </li>
        </ul>
        <section class="resources">
          <header>
            <h3 class="h3"><a href="index.html#automotive">automotive</a></h3> </header>
          <ul>
            <li> <a href="cars.html">cars</a> </li>
          </ul>
        </section>
      </nav>`;
    expectHtmlEqual(expected, result);
  });
});
