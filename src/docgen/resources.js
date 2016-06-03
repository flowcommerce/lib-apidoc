import marked from 'marked';
import Generator from './generator';
import ModelsGenerator from './models';
import { slug, slugToLabel, linkType } from './utils';

export default class ResourceGenerator extends Generator {
  constructor(service, resource, additionalDocs) {
    super(service, additionalDocs);
    this.resource = resource;
  }

  operationSlug(operation) {
    return slug(`${operation.method} ${operation.path}`);
  }

  getModelByType(type) {
    return this.service.models.find((m) => m.name === type);
  }

  parameterMaximum(parameter) {
    if (parameter.maximum) {
      return `<span class="block">Maximum: ${parameter.maximum}</span>`;
    }

    return '';
  }

  parameterMinimum(parameter) {
    if (parameter.minimum) {
      return `<span class="block">Minimum: ${parameter.minimum}</span>`;
    }

    return '';
  }

  parameterExample(parameter) {
    if (parameter.example) {
      return `<span class="block">Example: ${parameter.example}</span>`;
    }

    return '';
  }

  paramaterDescription(parameter) {
    if (parameter.description) {
      return parameter.description;
    }

    return '';
  }

  parameterDefault(parameter) {
    if (parameter.default) {
      return `
      <span class="parameter-default block">
        default: <strong>${parameter.default}</strong>
      </span>`;
    }

    return '';
  }

  optionalRequired(parameter) {
    if (parameter.required) {
      return '';
    }

    return '<span class="parameter-optional block">optional</span>';
  }

  generateParameter(parameter) {
    return `
      <div class="flex my2 table-row">
        <div class="parameter col-2 mr3 right-align">
          <span class="parameter-name block">${parameter.name}</span>
          ${this.optionalRequired(parameter)}
          ${this.parameterDefault(parameter)}
        </div>
        <div class="parameter-type col-1 mr3">${linkType(parameter.type)}</div>
        <div class="parameter-desc col-9">
          ${this.paramaterDescription(parameter)}
          ${this.parameterExample(parameter)}
          ${this.parameterMinimum(parameter)}
          ${this.parameterMaximum(parameter)}
        </div>
      </div>
      `;
  }

  operationDescription(operation) {
    if (operation.description) {
      return `
        <p class="operation-desc">${operation.description}</p>
      `;
    }

    return '';
  }

  generateResponse(response) {
    return `
      <div class="flex my2 table-row">
        <div class="parameter col-2 mr3 right-align">${response.code.integer.value}</div>
        <div class="parameter-type col-2 mr3">${linkType(response.type)}</div>
      </div>
    `;
  }

  getResourceOperationDoc(operation) {
    const doc = this.docs
      .filter((d) => d.type === 'resource:operation')
      .find((docPart) =>
        docPart.method === operation.method && operation.path === docPart.path
      );

    if (doc) {
      return `
        ${marked(doc.content)}
      `;
    }

    return '';
  }

  generateOperationBody(operation) {
    if (!operation.body) {
      return '';
    }

    const model = this.getModelByType(operation.body.type);
    const modelsGenerator = new ModelsGenerator(this.service, this.docs);

    return `
      <section class="body">
        <h3 class="h3">Body</h3>
        <p>This operation accepts a body of type ${linkType(operation.body.type)}.</p>
        <div class="flex my2 table-row">
          <div class="parameter table-header col-2 mr3 right-align">Name</div>
          <div class="parameter-type table-header col-1 mr3">Type</div>
          <div class="parameter-desc table-header col-9">Description</div>
        </div>
        ${model.fields.map((field) => modelsGenerator.generateField(field)).join('\n')}
      </section>
    `;
  }

  generateOperation(operation) {
    return `
    <section id="${this.operationSlug(operation)}" class="operation">
      <pre class="operation-name border rounded p1">${operation.method} ${operation.path}</pre>
      ${this.operationDescription(operation)}
      ${this.getResourceOperationDoc(operation)}

      <section class="parameters">
        <h3 class="h3">Parameters</h3>
        <div class="flex my2 table-row">
          <div class="parameter table-header col-2 mr3 right-align">Name</div>
          <div class="parameter-type table-header col-1 mr3">Type</div>
          <div class="parameter-desc table-header col-9">Description</div>
        </div>
        ${operation.parameters.map((parameter) => this.generateParameter(parameter)).join('\n')}
      </section>

      ${this.generateOperationBody(operation)}

      <section class="responses">
        <h3 class="h3">Responses</h3>
        <div class="flex my2 table-row">
          <div class="parameter table-header col-2 mr3 right-align">Code</div>
          <div class="parameter-type table-header col-2 mr3">Type</div>
        </div>
        ${operation.responses.map((response) => this.generateResponse(response)).join('\n')}
      </section>
    </section>
    `;
  }

  getResourceDoc() {
    const doc = this.docs
      .filter((d) => d.type === 'resource')
      .find((docPart) => docPart.name === this.resource.plural);

    if (doc) {
      return `
        <header class="header-block">
          ${marked(doc.content).trim()}
        </header>
      `;
    }

    return '';
  }

  generateResource() {
    return `
      <h1 class="h1 capitalize">${slugToLabel(this.resource.plural)}</h1>
      <section class="resource-sumamry">
        <h2 class="h2">Summary</h2>
        ${this.getResourceDoc()}
        ${this.resource.operations.map((operation) => `
          <p>
            <a href="#${this.operationSlug(operation)}">
              ${operation.method} ${operation.path}
            </a>
          </p>
          `).join('\n')}
      </section>
      <section class="resource">
        ${this.resource.operations.map((operation) =>
          this.generateOperation(operation)).join('\n')}
      </section>
    `;
  }

  generate() {
    return `
      <section>
        ${this.generateResource()}
      </section>
    `;
  }
}
