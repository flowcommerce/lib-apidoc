import { slug, slugToLabel, getDocAttributeModule, getOrderedModules } from './utils';

export default class NavigationGenerator {
  constructor(service) {
    this.service = service;
    this.resources = service.resources;
  }

  getGroupName(position) {
    return getOrderedModules(this.resources)[position];
  }

  resourceGroup(resources, groupName) {
    return `
      <header>
        <h3 class="h3"><a href="/#${slug(groupName)}">${groupName}</a></h3>
      </header>
      <ul>
        ${resources.map((r) =>
          `<li>
              <a href="${slug(r.plural)}.html">${slugToLabel(r.plural)}</a>
          </li>`).join('\n')}
      </ul>
    `;
  }

  getMappedResources() {
    const map = {};
    this.resources.forEach((resource) => {
      const module = getDocAttributeModule(resource.attributes);
      if (!module) {
        throw new Error(`Expected resource[${resource.plural}] to have a docs.value.module attribute.`); // eslint-disable-line max-len
      }

      if (!map[module]) {
        map[module] = [];
      }

      map[module] = map[module].concat(resource);
    });

    return map;
  }

  generateResources() {
    const mappedResources = this.getMappedResources();

    return `
      <section class="resources">
        ${getOrderedModules(this.resources).map((module) =>
            this.resourceGroup(mappedResources[module], module)).join('\n')}
      </section>
    `;
  }

  generate() {
    return `
      <nav class="left-navigation">
        <header class="header">
          <a href="/">
            <img class="logo" src="/assets/0.0.1/img/flow_logo.svg" />
          </a>
          <section class="title">API Reference</section>
          <p class="version">Version: ${this.service.version}</p>
        </header>

        <header>
          <h3 class="h3"><a href="/#api">Getting Started</a></h3>
        </header>
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

        ${this.generateResources()}
      </nav>
    `;
  }
}
