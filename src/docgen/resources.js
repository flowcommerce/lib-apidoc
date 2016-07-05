import marked from 'marked';
import fs from 'fs';
import Generator from './generator';
import ModelsGenerator from './models';
import { slug, slugToLabel } from './utils';

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
    if (typeof parameter.maximum !== 'undefined' && parameter.maximum !== null) {
      return `<span class="block">Maximum: ${parameter.maximum}</span>`;
    }

    return '';
  }

  parameterMinimum(parameter) {
    if (typeof parameter.minimum !== 'undefined' && parameter.minimum !== null) {
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
        <div class="parameter-type col-2 mr3">${this.linkType(parameter.type)}</div>
        <div class="parameter-desc col-8">
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
        <div class="parameter-type col-2 mr3">${this.linkType(response.type)}</div>
        <div class="parameter-type col-8 mr3">${response.description || ''}</div>
      </div>`;
  }

  getResourceOperationDoc(operation) {
    const doc = this.docs
      .filter((d) => d.type === 'resource:operation')
      .find((docPart) =>
        docPart.method === operation.method && operation.path === docPart.path
      );

    if (doc) {
      return `
        <div class="md-content">
          ${marked(doc.content)}
        </div>
      `;
    }

    return '';
  }

  generateBodyFields(model) {
    if (!model || !model.fields || !model.fields.length) {
      return '';
    }

    const modelsGenerator = new ModelsGenerator(this.service, this.docs);

    return `
      <div class="flex my2 table-row">
        <div class="parameter table-header col-2 mr3 right-align">Name</div>
        <div class="parameter-type table-header col-2 mr3">Type</div>
        <div class="parameter-desc table-header col-8">Description</div>
      </div>
      ${model.fields.map((field) => modelsGenerator.generateField(field)).join('\n')}`;
  }

  generateOperationBody(operation) {
    if (!operation.body) {
      return '';
    }

    const model = this.getModelByType(operation.body.type);

    return `
      <section class="body">
        <h3 class="h3">Body</h3>
        <p>This operation accepts a body of type ${this.linkType(operation.body.type)}.</p>
        ${this.generateBodyFields(model)}
      </section>
    `;
  }

  generateOperationExampleRequest(operation) {
    if (operation.method.toUpperCase() === 'GET') {
      return `
      <section class="example-request">
        <h3 class="h3">Example Request</h3>
        <p>cURL command:</p>
        <pre><code>curl -u &lt;api-token&gt;: https://api.flow.io${operation.path}</code></pre>
      </section>`;
    }

    // eslint-disable-next-line
    const filepath = `/tmp/sample-json/0.0.40/${this.resource.plural}/${operation.method.toLowerCase()}/${operation.path}/request.advanced.json`;

    if (!fs.existsSync(filepath)) {
      return '';
    }

    return `
    <section class="example-request">
      <h3 class="h3">Example Request</h3>
      <p>cURL command:</p>
      <pre><code>curl -X ${operation.method.toUpperCase()} -d @body.json -u &lt;api-token&gt;: https://api.flow.io${operation.path}</code></pre>
      <p>body.json:</p>
      <pre><code>${fs.readFileSync(filepath, { encoding: 'utf8' })}</code></pre>
    </section>`;
  }

  generateOperationExampleResponse(operation) {
    // eslint-disable-next-line
    const filepath = `/tmp/sample-json/0.0.40/${this.resource.plural}/${operation.method.toLowerCase()}/${operation.path}/response.advanced.json`;

    if (!fs.existsSync(filepath)) {
      return '';
    }

    return `
    <section class="example-response">
      <h3 class="h3">Example Response</h3>
      <pre><code>${fs.readFileSync(filepath, { encoding: 'utf8' })}</code></pre>
    </section>`;
  }

  generateOperation(operation) {
    return `
    <section id="${this.operationSlug(operation)}" class="header-block">
      <pre class="operation-name border rounded p1">${operation.method} ${operation.path}</pre>
      ${this.operationDescription(operation)}
      ${this.getResourceOperationDoc(operation)}

      <section class="parameters">
        <h3 class="h3">Parameters</h3>
        <div class="flex my2 table-row">
          <div class="parameter table-header col-2 mr3 right-align">Name</div>
          <div class="parameter-type table-header col-2 mr3">Type</div>
          <div class="parameter-desc table-header col-8">Description</div>
        </div>
        ${operation.parameters.map((parameter) => this.generateParameter(parameter)).join('\n')}
      </section>

      ${this.generateOperationBody(operation)}

      <section class="responses">
        <h3 class="h3">Responses</h3>
        <div class="flex my2 table-row">
          <div class="parameter table-header col-2 mr3 right-align">Code</div>
          <div class="parameter-type table-header col-2 mr3">Type</div>
          <div class="parameter-desc table-header col-8">Description</div>
        </div>
        ${operation.responses.map((response) => this.generateResponse(response)).join('\n')}
      </section>

      ${this.generateOperationExampleRequest(operation)}
      ${this.generateOperationExampleResponse(operation)}
    </section>
    `;
  }

  getResourceDoc() {
    const doc = this.docs
      .filter((d) => d.type === 'resource')
      .find((docPart) => docPart.name.toLowerCase() === this.resource.plural);

    if (doc) {
      return `
        <header class="md-content">
          ${marked(doc.content).trim()}
        </header>
      `;
    }

    return '';
  }

  getResourceDescription() {
    if (this.resource.description) {
      return `
        <h2 class="h2">Summary</h2>
        <p>${this.resource.description}</p>`;
    }
    return '';
  }

  generateResource() {
    return `
      <h1 class="h1 capitalize">${slugToLabel(this.resource.plural)}</h1>
      <section class="header-block">
        ${this.getResourceDescription()}
        ${this.getResourceDoc()}
        <h2 class="h2">Operations</h2>
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
