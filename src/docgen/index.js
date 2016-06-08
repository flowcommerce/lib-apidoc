import ResourceGenerator from './resources';
import ModelsGenerator from './models';
import UnionsGenerator from './unions';
import EnumsGenerator from './enums';
import Generator from './generator';
import { slug, slugToLabel, getDocAttributeModule, getOrderedModules } from './utils';


export class TypesFileGenerator extends Generator {
  generate() {
    const modelsGenerator = new ModelsGenerator(this.service, this.docs);
    const enumsGenerator = new EnumsGenerator(this.service, this.docs);
    const unionsGenerator = new UnionsGenerator(this.service, this.docs);

    const content = this.htmlDocument(`
      <h1 class="h1">Types</h1>
      ${modelsGenerator.generate()}
      ${enumsGenerator.generate()}
      ${unionsGenerator.generate()}`);

    return {
      path: 'types.html',
      content,
    };
  }
}

export class ResourceFilesGenerator extends Generator {
  generateResourceFile(resource) {
    const resourceGenerator = new ResourceGenerator(this.service, resource, this.docs);

    const content = this.htmlDocument(`
      ${resourceGenerator.generate()}`);

    return {
      path: `${slug(resource.plural)}.html`,
      content,
    };
  }

  generate() {
    return this.service.resources.map((r) => this.generateResourceFile(r));
  }
}

export class IndexFileGenerator extends Generator {
  moduleSection(service, module) {
    const moduleResources = service.resources
      .filter((r) => getDocAttributeModule(r.attributes) === module);
    return `
      <section class="module header-block">
        <h2>${module}</h2>
        <div class="md-content">
          ${this.contentByType('module', module)}
        </div>
        <section>
          <h2>Resources</h2>
          <ul>
            ${moduleResources.map((r) => `
              <li>
                <a class="resource-link" href="${slug(r.plural)}.html">${slugToLabel(r.plural)}</a>
              </li>
            `).join('\n')}
          </ul>
        </section>
      </section>
    `;
  }

  generate() {
    const orderedModules = getOrderedModules(this.service.resources);

    const content = this.htmlDocument(`
      <h1 class="h1">Flow Commerce API Documentation</h1>
      <p class="service-description">${this.service.description}</p>
      <h2 class="h2">API</h2>
      <section class="header-block md-content">
        ${this.contentByType('section', 'api')}
      </section>
      <h2 class="h2">Modules</h2>
      ${orderedModules.map((module) => this.moduleSection(this.service, module)).join('\n')}`);

    return {
      path: 'index.html',
      content,
    };
  }
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
  const indexGenerator = new IndexFileGenerator(service, additionalDocs);
  const typesGenerator = new TypesFileGenerator(service, additionalDocs);
  const resourceFilesGenerator = new ResourceFilesGenerator(service, additionalDocs);
  return [
    indexGenerator.generate(service, additionalDocs),
    typesGenerator.generate(service, additionalDocs),
  ].concat(resourceFilesGenerator.generate(service, additionalDocs));
}

export default { generate };
