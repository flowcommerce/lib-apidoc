export function generateValue(value) {
  return `
    <div class="flex my2">
      <div class="value-name col-2 mr3 right-align">${value.name}</div>
      <div class="value-desc flex-auto">${value.description}</div>
    </div>
  `;
}

export function generateEnums(enumerator) {
  return `
    <section class="enum">
      <header class="header-block">
        <h3 class="h3">${enumerator.name}</h3>
        <p>${enumerator.description}</p>
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

export function generate(enums) {
  return `
    <section>
      <header>
        <h2 class="h2">Enums</h2>
      </header>
      ${enums.map((e) => generateEnums(e)).join('\n')}
    </section>
  `;
}

export default { generate };
