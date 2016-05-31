export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export function linkType(type) {
  let normalizedType = type;

  if (type.startsWith('[')) {
    normalizedType = type.replace('[', '').replace(']', '');
  }

  return type.replace(
    normalizedType,
    `<a href="#type-${slug(normalizedType)}">${normalizedType}</a>`
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
      <div class="parameter-type col-1 mr3">${linkType(parameter.type)}</div>
      <div class="parameter-desc flex-auto">
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
      <div class="parameter-type col-1 mr3">${linkType(response.type)}</div>
    </div>
  `;
}

export function generateOperation(operation) {
  return `
  <section class="operation">
    <pre class="operation-name border rounded p1">${operation.method} ${operation.path}</pre>
    ${operationDescription(operation)}

    <section class="parameters">
      <h5 class="h4">Parameters</h5>
      <div class="flex my2">
        <div class="parameter table-header col-2 mr3 right-align">Name</div>
        <div class="parameter-type table-header col-1 mr3">Type</div>
        <div class="parameter-desc table-header flex-auto">Description</div>
      </div>
      ${operation.parameters.map((parameter) => generateParameter(parameter)).join('\n')}
    </section>

    <section class="responses">
      <h5 class="h4">Responses</h5>
      <div class="flex my2">
        <div class="parameter table-header col-2 mr3 right-align">Code</div>
        <div class="parameter-type table-header col-1 mr3">Type</div>
      </div>
      ${operation.responses.map((response) => generateResponse(response)).join('\n')}
    </section>
  </section>
  `;
}

export function generateResource(resource) {
  return `
    <section class="resource">
      <h3 id="resource-${slug(resource.plural)}" class="h3 header-block">${resource.plural}</h3>
      ${resource.operations.map((operation) => generateOperation(operation)).join('\n')}
    </section>
  `;
}

export function generate(resources) {
  return `
<section>
  <header>
    <h2 class="h2">Resources</h2>
  </header>
  ${resources.map((resource) => generateResource(resource)).join('\n')}
</section>
  `;
}

export default { generate };
