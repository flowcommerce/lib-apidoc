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
        <h3 class="h3"><a href="/#foo">foo</a></h3>
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
          <h3 class="h3"><a href="/#automotive">automotive</a></h3> </header>
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
          <a href="/"> <img class="logo" src="/assets/0.0.1/img/flow_logo.svg" /> </a>
          <section class="title">API Reference</section>
          <p class="version">Version: undefined</p>
        </header>
        <header>
          <h3 class="h3"><a href="/#api">Getting Started</a></h3> </header>
        <ul>
          <li><a href="/#register-with-flow-commerce">Register</a></li>
          <li><a href="/#obtain-your-api-key">API Key</a></li>
          <li><a href="/#how-to-authenticate">Authentication</a></li>
          <li><a href="/#types">Types</a></li>
          <li><a href="/#operations-and-responses">Operations and Responses</a></li>
          <li><a href="/#native-libraries">Libraries</a></li>
          <li><a href="/#getting-help">Getting Help</a></li>
          <li><a href="/#next-steps">Next Steps</a></li>
          </li>
        </ul>
        <header>
          <h3 class="h3"><a href="/#integration-overview">Integration</a></h3> </header>
        <ul>
          <li><a href="/#product-catalog">Product Catalog</a></li>
          <li><a href="/#experiences">Experiences</a></li>
          <li><a href="/#landed-cost-integration">Landed Cost Integration</a></li>
          <li><a href="/#logistics-setup">Logistics Setup</a></li>
          <li><a href="/#orders">Orders</a></li>
          <li><a href="/#payment-apis">Payment APIs</a></li>
          <li><a href="/#payment-javascript">Payment JavaScript</a></li>
          <li><a href="/#bookings">Bookings</a></li>
        </ul>
        <section class="resources">
          <header>
            <h3 class="h3"><a href="/#automotive">automotive</a></h3> </header>
          <ul>
            <li> <a href="cars.html">cars</a> </li>
          </ul>
        </section>
      </nav>`;
    expectHtmlEqual(expected, result);
  });
});
