import marked from 'marked';

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
    `<a href="types.html#type-${slug(normalizedType)}">${normalizedType}</a>`
  );
}

export function fieldMaximum(field) {
  if (field.maximum) {
    return `<span class="block">Maximum: ${field.maximum}</span>`;
  }

  return '';
}

export function fieldMinimum(field) {
  if (field.minimum) {
    return `<span class="block">Minimum: ${field.minimum}</span>`;
  }

  return '';
}

export function fieldExample(field) {
  if (field.example) {
    return `<span class="block">Example: ${field.example}</span>`;
  }

  return '';
}

export function fieldDefault(field) {
  if (field.default) {
    return `
    <span class="field-default block">
      default: <strong>${field.default}</strong>
    </span>`;
  }

  return '';
}

export function optionalRequired(field) {
  if (field.required) {
    return '<span class="field-required block">required</span>';
  }

  return '<span class="field-optional block">optional</span>';
}

export function fieldDescription(field) {
  if (field.description) {
    return field.description;
  }

  return '';
}

export function generateField(field) {
  return `
    <div class="flex my2">
      <div class="field col-2 mr3 right-align">
        <span class="field-name block">${field.name}</span>
        ${optionalRequired(field)}
        ${fieldDefault(field)}
      </div>
      <div class="field-type col-2 mr3">${linkType(field.type)}</div>
      <div class="field-desc col-8">
        ${fieldDescription(field)}
        ${fieldExample(field)}
        ${fieldMinimum(field)}
        ${fieldMaximum(field)}
      </div>
    </div>
    `;
}

export function getModelDoc(model, additionalDocs) {
  const doc = additionalDocs
    .filter((d) => d.type === 'model')
    .find((docPart) => docPart.name === model.name);

  if (doc) {
    return `
      ${marked(doc.content)}
    `;
  }

  return '';
}

export function generateModel(model, additionalDocs) {
  return `
    <section class="model">
      <h3 id="type-${slug(model.name)}" class="h3">${model.name}</h3>
      ${getModelDoc(model, additionalDocs)}
      <section class="fields">
        <h5 class="h4">Fields</h5>
        <div class="flex my2">
          <div class="field table-header col-2 mr3 right-align">Name</div>
          <div class="field-type table-header col-2 mr3">Type</div>
          <div class="field-desc table-header col-8">Description</div>
        </div>
        ${model.fields.map((field) => generateField(field)).join('\n')}
      </section>
    </section>
  `;
}

export function generate(models, additionalDocs) {
  return `
    <section>
      <header>
        <h2 class="h2">Models</h2>
      </header>
      ${models.map((model) => generateModel(model, additionalDocs)).join('\n')}
    </section>
  `;
}

export default { generate };
