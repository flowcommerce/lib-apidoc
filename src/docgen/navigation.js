export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export function resourceGroup(resources, groupName) {
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

export function getDocAttributeModule(attributes) {
  const docs = attributes.find((a) => a.name === 'docs');
  if (docs.value && docs.value.module) {
    return docs.value.module;
  }

  return null;
}

export function getOrderedModules(resources) {
  let ordering = [];
  resources.forEach((resource) => {
    const module = getDocAttributeModule(resource.attributes);
    if (!module) {
      throw new Error(`Expected resource[${resource.plural}] to have a docs.value.module attribute.`); // eslint-disable-line max-len
    }

    if (!ordering.includes(module)) {
      ordering = ordering.concat(module);
    }
  });

  return ordering;
}

export function getGroupName(resources, position) {
  return getOrderedModules(resources)[position];
}

export function getMappedResources(resources) {
  const map = {};
  resources.forEach((resource) => {
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

export function generateResources(resources) {
  const mappedResources = getMappedResources(resources);

  return `
    <section class="resources">
      ${getOrderedModules(resources).map((module) =>
          resourceGroup(mappedResources[module], module)).join('\n')}
    </section>
  `;
}

export function generate(service) {
  return `
    <nav class="left-navigation">
      <header class="header">
        <a href="index.html">
          <img class="logo" src="/assets/0.0.1/img/flow_logo.svg" />
        </a>
        <section class="title">API Reference</section>
        <p class="version">Version: ${service.version}</p>
      </header>

      ${generateResources(service.resources)}
    </nav>
  `;
}

export default { generate };
