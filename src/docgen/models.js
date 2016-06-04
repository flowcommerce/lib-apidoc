import marked from 'marked';
import Generator from './generator';
import { slug, linkType } from './utils';

export default class ModelsGenerator extends Generator {
  fieldMaximum(field) {
    if (field.maximum) {
      return `<span class="block">Maximum: ${field.maximum}</span>`;
    }

    return '';
  }

  fieldMinimum(field) {
    if (field.minimum) {
      return `<span class="block">Minimum: ${field.minimum}</span>`;
    }

    return '';
  }

  fieldExample(field) {
    if (field.example) {
      return `<span class="block">Example: ${field.example}</span>`;
    }

    return '';
  }

  fieldDefault(field) {
    if (field.default) {
      return `
      <span class="field-default block">
        default: <strong>${field.default}</strong>
      </span>`;
    }

    return '';
  }

  optionalRequired(field) {
    if (field.required) {
      return '';
    }

    return '<span class="field-optional block">optional</span>';
  }

  fieldDescription(field) {
    if (field.description) {
      return field.description;
    }

    return '';
  }

  generateField(field) {
    return `
      <div class="flex my2 table-row">
        <div class="field col-2 mr3 right-align">
          <span class="field-name block">${field.name}</span>
          ${this.optionalRequired(field)}
          ${this.fieldDefault(field)}
        </div>
        <div class="field-type col-1 mr3">${this.linkType(field.type)}</div>
        <div class="field-desc col-9">
          ${this.fieldDescription(field)}
          ${this.fieldExample(field)}
          ${this.fieldMinimum(field)}
          ${this.fieldMaximum(field)}
        </div>
      </div>
      `;
  }

  getModelDoc(model) {
    const doc = this.docs
      .filter((d) => d.type === 'model')
      .find((docPart) => docPart.name === model.name);

    if (doc) {
      return `
        ${marked(doc.content).trim()}
      `;
    }

    return '';
  }

  generateModel(model) {
    return `
      <section class="model">
        <h3 id="type-${slug(model.name)}" class="h3">${model.name}</h3>
        ${this.getModelDoc(model).trim()}
        <section class="fields">
          <h5 class="h4">Fields</h5>
          <div class="flex my2 table-row">
            <div class="field table-header col-2 mr3 right-align">Name</div>
            <div class="field-type table-header col-1 mr3">Type</div>
            <div class="field-desc table-header col-9">Description</div>
          </div>
          ${model.fields.map((field) => this.generateField(field)).join('\n')}
        </section>
      </section>
    `;
  }

  generate() {
    return `
      <section>
        <header>
          <h2 class="h2">Models</h2>
        </header>
        ${this.service.models.map((model) => this.generateModel(model)).join('\n')}
      </section>
    `;
  }
}
