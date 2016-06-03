import { slug, getDocAttributeModule, getOrderedModules } from './utils';

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
        <h3 class="h3">${groupName}</h3>
      </header>
      <ul>
        ${resources.map((r) =>
          `<li><a href="${slug(r.plural)}.html">${r.plural}</a></li>`).join('\n')}
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
          <a href="index.html">
            <img class="logo" src="/assets/0.0.1/img/flow_logo.svg" />
          </a>
          <section class="title">API Reference</section>
          <p class="version">Version: ${this.service.version}</p>
        </header>

        ${this.generateResources()}
      </nav>
    `;
  }
}
