import resources from './resources';
import models from './models';
import unions from './unions';
import enums from './enums';
import navigation from './navigation';

export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export function getDocAttributeModule(attributes) {
  const docs = attributes.find((a) => a.name === 'docs');
  if (docs.value && docs.value.module) {
    return docs.value.module;
  }

  return null;
}

export function getOrderedModules(service) {
  let ordering = [];
  service.resources.forEach((resource) => {
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

export function htmlDocument(body) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300' rel='stylesheet' type='text/css'>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.min.css" rel="stylesheet">
        <link href="https://npmcdn.com/basscss@8.0.1/css/basscss.min.css" rel="stylesheet">
        <link href="index.css" rel="stylesheet">
      </head>
      <body>
        ${body}
        <script src="index.js"></script>
      </body>
    </html>`;
}

export function generateTypesFile(service, additionalDocs) {
  const content = htmlDocument(`
    <main class="main flex">
      ${navigation.generate(service)}
      <section class="p2 main-content flex-auto">
        <h1 class="h1">Types</h1>
        ${models.generate(service, additionalDocs)}
        ${enums.generate(service.enums, additionalDocs)}
        ${unions.generate(service.unions, additionalDocs)}
      </section>
    </main>`);

  return {
    path: 'types.html',
    content,
  };
}

export function generateResourceFile(service, resource, additionalDocs) {
  const content = htmlDocument(`
    <main class="main flex">
      ${navigation.generate(service)}
      <section class="p2 main-content flex-auto">
        ${resources.generate(service, resource, additionalDocs)}
      </section>
    </main>`);

  return {
    path: `${slug(resource.plural)}.html`,
    content,
  };
}

export function generateResourceFiles(service, additionalDocs) {
  return service.resources.map((r) => generateResourceFile(service, r, additionalDocs));
}

export function moduleSection(service, module) {
  const moduleResources = service.resources
    .filter((r) => getDocAttributeModule(r.attributes) === module);
  return `
    <section class="module">
      <h3 class="h3 header-block">${module}</h3>
      <section class="header-block">
        <ul>
          ${moduleResources.map((r) => `
            <li><a href="${slug(r.plural)}.html">${r.plural}</a></li>
          `).join('\n')}
        </ul>
      </section>
    </section>
  `;
}

export function generateIndexFile(service) {
  const orderedModules = getOrderedModules(service);

  const content = htmlDocument(`
    <main class="main flex">
      ${navigation.generate(service)}
      <section class="p2 main-content flex-auto">
        <h1 class="h1">${service.name}</h1>
        <p class="service-description">${service.description}</p>
        <h2 class="h2">Modules</h2>
        ${orderedModules.map((module) => moduleSection(service, module)).join('\n')}
      </section>
    </main>`);

  return {
    path: 'index.html',
    content,
  };
}

/**
 * Returns array of File
 *
 * File is: {
 * 	path: 'index.html',
 * 	contents: 'file contents',
 * }
 */
export function generate(service, additionalDocs = []) {
  return [
    generateIndexFile(service),
    generateTypesFile(service, additionalDocs),
  ].concat(generateResourceFiles(service, additionalDocs));
}

export default { generate };
