export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
    .replace(/(\s+|_)/gi, '-')
    .toLowerCase();
}

export function generateUnions(unions) {
  return `
    <section class="unions">
      <header>
        <h3 class="h3">Unions</h3>
      </header>
      <ul>
        ${unions.map((u) =>
          `<li><a href="#type-${slug(u.name)}">${u.name}</a></li>`).join('\n')}
      </ul>
    </section>
  `;
}

export function generateEnums(enums) {
  return `
    <section class="enums">
      <header>
        <h3 class="h3">Enums</h3>
      </header>
      <ul>
        ${enums.map((e) =>
          `<li><a href="#type-${slug(e.name)}">${e.name}</a></li>`).join('\n')}
      </ul>
    </section>
  `;
}

export function generateModels(models) {
  return `
    <section class="models">
      <header>
        <h3 class="h3">Models</h3>
      </header>
      <ul>
        ${models.map((m) =>
          `<li><a href="#type-${slug(m.name)}">${m.name}</a></li>`).join('\n')}
      </ul>
    </section>
  `;
}

export function generateResources(resources) {
  return `
    <section class="resources">
      <header>
        <h3 class="h3">Resources</h3>
      </header>
      <ul>
        ${resources.map((r) =>
          `<li><a href="#resource-${slug(r.plural)}">${r.plural}</a></li>`).join('\n')}
      </ul>
    </section>
  `;
}

/**
 *   ${generateModels(service.models)}
   ${generateEnums(service.enums)}
   ${generateUnions(service.unions)}

 * @param  {[type]} service [description]
 * @return {[type]}         [description]
 */
export function generate(service) {
  return `
    <nav class="left-navigation">
      <section class="title">API Reference</section>
      ${generateResources(service.resources)}
    </nav>
  `;
}

export default { generate };
