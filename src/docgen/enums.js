import marked from 'marked';
import Generator from './generator';
import { slug } from './utils';


export default class EnumsGenerator extends Generator {
  enumDescription(enumerator) {
    if (enumerator.description) {
      return `<p>${enumerator.description}</p>`;
    }
    return '';
  }

  generateValue(value) {
    return `
          <div class="flex my2 table-row">
            <div class="value-name col-2 mr3 right-align">${value.name}</div>
            <div class="value-desc flex-auto">${value.description || ''}</div>
          </div>`;
  }

  getEnumDoc(enumerator) {
    const doc = this.docs
      .filter((d) => d.type === 'enum')
      .find((docPart) => docPart.name === enumerator.name);

    if (doc) {
      return marked(doc.content).trim();
    }

    return '';
  }

  generateEnum(enumerator) {
    return `
      <section class="enum">
        <header id="type-${slug(enumerator.name)}">
          <h3 class="h3">${enumerator.name}</h3>
          ${this.enumDescription(enumerator)}
          ${this.getEnumDoc(enumerator)}
        </header>
        <section class="values">
          <h5 class="h4">Values</h5>
          <div class="flex my2 table-row">
            <div class="value table-header col-2 mr3 right-align">Name</div>
            <div class="value-desc table-header flex-auto">Description</div>
          </div>
          ${enumerator.values.map((value) => this.generateValue(value)).join('\n')}
        </section>
      </section>`;
  }

  generate() {
    return `
      <section>
        <header>
          <h2 class="h2">Enums</h2>
        </header>
        ${this.service.enums.map((e) => this.generateEnum(e)).join('\n')}
      </section>`;
  }
}
