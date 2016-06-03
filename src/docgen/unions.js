import Generator from './generator';
import { slug, linkType } from './utils';

export default class UnionsGenerator extends Generator {
  generateUnion(union) {
    const types = union.types.map((t) => linkType(t.type));
    return `
      <div id="type-${slug(union.name)}" class="flex my2">
        <div class="union-name col-2 mr3 right-align">${union.name}</div>
        <div class="union-types flex-auto">${types.join(', ')}</div>
      </div>
    `;
  }

  generate() {
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
          ${this.service.unions.map((union) => this.generateUnion(union)).join('\n')}
        </section>
      </section>
    `;
  }
}
