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

export function generateUnion(union) {
  const types = union.types.map((t) => linkType(t.type));
  return `
    <div id="type-${slug(union.name)}" class="flex my2">
      <div class="union-name col-2 mr3 right-align">${union.name}</div>
      <div class="union-types flex-auto">${types.join(', ')}</div>
    </div>
  `;
}

export function generate(unions) {
  return `
    <section>
      <header>
        <h2 class="h2">Unions</h2>
      </header>
      <section class="unions">
        <div class="flex my2">
          <div class="union table-header col-2 mr3 right-align">Name</div>
          <div class="union-types table-header flex-auto">Types</div>
        </div>
        ${unions.map((union) => generateUnion(union)).join('\n')}
      </section>
    </section>
  `;
}

export default { generate };
