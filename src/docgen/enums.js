import marked from 'marked';

export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export function generateValue(value) {
  return `
    <div class="flex my2">
      <div class="value-name col-2 mr3 right-align">${value.name}</div>
      <div class="value-desc flex-auto">${value.description}</div>
    </div>
  `;
}

export function getEnumDoc(enumerator, additionalDocs) {
  const doc = additionalDocs
    .filter((d) => d.type === 'enum')
    .find((docPart) => docPart.name === enumerator.name);

  if (doc) {
    return `
      ${marked(doc.content)}
    `;
  }

  return '';
}

export function generateEnums(enumerator, additionalDocs) {
  return `
    <section class="enum">
      <header id="type-${slug(enumerator.name)}">
        <h3 class="h3">${enumerator.name}</h3>
        <p>${enumerator.description}</p>
        ${getEnumDoc(enumerator, additionalDocs)}
      </header>
      <section class="values">
        <h5 class="h4">Values</h5>
        <div class="flex my2">
          <div class="value table-header col-2 mr3 right-align">Name</div>
          <div class="value-desc table-header flex-auto">Description</div>
        </div>
        ${enumerator.values.map((value) => generateValue(value)).join('\n')}
      </section>
    </section>
  `;
}

export function generate(enums, additionalDocs) {
  return `
    <section>
      <header>
        <h2 class="h2">Enums</h2>
      </header>
      ${enums.map((e) => generateEnums(e, additionalDocs)).join('\n')}
    </section>
  `;
}

export default { generate };
