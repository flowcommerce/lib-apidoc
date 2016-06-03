import marked from 'marked';

export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export function operationSlug(operation) {
  return slug(`${operation.method} ${operation.path}`);
}

export function linkType(type) {
  let normalizedType = type;

  if (type.startsWith('[')) {
    normalizedType = type.replace('[', '').replace(']', '');
  }

  return type.replace(
    normalizedType,
    `<a href="types.html#type-${slug(normalizedType)}">${normalizedType}</a>`
  );
}

export function parameterMaximum(parameter) {
  if (parameter.maximum) {
    return `<span class="block">Maximum: ${parameter.maximum}</span>`;
  }

  return '';
}

export function parameterMinimum(parameter) {
  if (parameter.minimum) {
    return `<span class="block">Minimum: ${parameter.minimum}</span>`;
  }

  return '';
}

export function parameterExample(parameter) {
  if (parameter.example) {
    return `<span class="block">Example: ${parameter.example}</span>`;
  }

  return '';
}

export function paramaterDescription(parameter) {
  if (parameter.description) {
    return parameter.description;
  }

  return '';
}

export function parameterDefault(parameter) {
  if (parameter.default) {
    return `
    <span class="parameter-default block">
      default: <strong>${parameter.default}</strong>
    </span>`;
  }

  return '';
}

export function optionalRequired(parameter) {
  if (parameter.required) {
    return '<span class="parameter-required block">required</span>';
  }

  return '<span class="parameter-optional block">optional</span>';
}

export function generateParameter(parameter) {
  return `
    <div class="flex my2">
      <div class="parameter col-2 mr3 right-align">
        <span class="parameter-name block">${parameter.name}</span>
        ${optionalRequired(parameter)}
        ${parameterDefault(parameter)}
      </div>
      <div class="parameter-type col-2 mr3">${linkType(parameter.type)}</div>
      <div class="parameter-desc col-8">
        ${paramaterDescription(parameter)}
        ${parameterExample(parameter)}
        ${parameterMinimum(parameter)}
        ${parameterMaximum(parameter)}
      </div>
    </div>
    `;
}

export function operationDescription(operation) {
  if (operation.description) {
    return `
      <p class="operation-desc">${operation.description}</p>
    `;
  }

  return '';
}

export function generateResponse(response) {
  return `
    <div class="flex my2">
      <div class="parameter col-2 mr3 right-align">${response.code.integer.value}</div>
      <div class="parameter-type col-2 mr3">${linkType(response.type)}</div>
    </div>
  `;
}

export function getResourceOperationDoc(operation, additionalDocs) {
  const doc = additionalDocs
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

export function generateOperation(operation, additionalDocs) {
  return `
  <section id="${operationSlug(operation)}" class="operation">
    <pre class="operation-name border rounded p1">${operation.method} ${operation.path}</pre>
    ${operationDescription(operation)}
    ${getResourceOperationDoc(operation, additionalDocs)}

    <section class="parameters">
      <h5 class="h4">Parameters</h5>
      <div class="flex my2">
        <div class="parameter table-header col-2 mr3 right-align">Name</div>
        <div class="parameter-type table-header col-2 mr3">Type</div>
        <div class="parameter-desc table-header col-8">Description</div>
      </div>
      ${operation.parameters.map((parameter) => generateParameter(parameter)).join('\n')}
    </section>

    <section class="responses">
      <h5 class="h4">Responses</h5>
      <div class="flex my2">
        <div class="parameter table-header col-2 mr3 right-align">Code</div>
        <div class="parameter-type table-header col-2 mr3">Type</div>
      </div>
      ${operation.responses.map((response) => generateResponse(response)).join('\n')}
    </section>
  </section>
  `;
}

export function getResourceDoc(resource, additionalDocs) {
  const doc = additionalDocs
    .filter((d) => d.type === 'resource')
    .find((docPart) => docPart.name === resource.plural);

  if (doc) {
    return `
      <header class="header-block">
        ${marked(doc.content)}
      </header>
    `;
  }

  return '';
}

export function generateResource(resource, additionalDocs) {
  return `
    <h1 class="h1">${resource.plural}</h1>
    <section class="resource-sumamry">
      <h2 class="h2">Summary</h2>
      ${getResourceDoc(resource, additionalDocs)}
      ${resource.operations.map((operation) => `
        <p><a href="#${operationSlug(operation)}">${operation.method} ${operation.path}</a></p>
        `).join('\n')}
    </section>
    <section class="resource">
      ${resource.operations.map((operation) =>
        generateOperation(operation, additionalDocs)).join('\n')}
    </section>
  `;
}

export function generate(resources, additionalDocs) {
  return `
<section>
  ${resources.map((resource) => generateResource(resource, additionalDocs)).join('\n')}
</section>
  `;
}

export default { generate };
