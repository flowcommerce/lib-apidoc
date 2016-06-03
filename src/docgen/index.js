import ResourceGenerator from './resources';
import ModelsGenerator from './models';
import UnionsGenerator from './unions';
import EnumsGenerator from './enums';
import Generator from './generator';
import { slug, getDocAttributeModule, getOrderedModules } from './utils';


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

  generate() {
    const orderedModules = getOrderedModules(this.service.resources);

    const content = this.htmlDocument(`
      <h1 class="h1">${this.service.name}</h1>
      <p class="service-description">${this.service.description}</p>
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
