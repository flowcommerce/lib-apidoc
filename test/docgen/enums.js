/* global describe, it */
import EnumsGenerator from '../../src/docgen/enums';
import { expectHtmlEqual } from '../util';

describe('enums', () => {
  it('should get an enum doc', () => {
    const enumerator = {
      name: 'calendar',
    };
    const docParts = [
      {
        type: 'enum',
        name: 'calendar',
        content: '\nSome information about calendars\n\n',
      },
    ];
    const generator = new EnumsGenerator({}, docParts);
    const expected = '<p>Some information about calendars</p>';
    const result = generator.getEnumDoc(enumerator, docParts);

    expectHtmlEqual(result, expected);
  });

  it('should get an empty enum doc', () => {
    const enumerator = {
      name: 'calendar',
    };
    const docParts = [];
    const generator = new EnumsGenerator({}, docParts);
    const expected = '';
    const result = generator.getEnumDoc(enumerator, docParts);

    expectHtmlEqual(result, expected);
  });

  it('should get an enum description', () => {
    const enumerator = {
      name: 'calendar',
      description: 'calendar description',
    };
    const generator = new EnumsGenerator({}, []);
    const expected = '<p>calendar description</p>';
    const result = generator.enumDescription(enumerator);

    expectHtmlEqual(result, expected);
  });

  it('should not get an enum description', () => {
    const enumerator = { name: 'calendar' };
    const generator = new EnumsGenerator({}, []);
    const expected = '';
    const result = generator.enumDescription(enumerator);

    expectHtmlEqual(result, expected);
  });

  it('should generate a value', () => {
    const value = {
      name: 'weekdays',
      description: 'Monday - Friday',
    };
    const generator = new EnumsGenerator({}, []);
    const expected = `
      <div class="flex my2 table-row">
        <div class="value-name col-2 mr3 right-align">weekdays</div>
        <div class="value-desc flex-auto">Monday - Friday</div>
      </div>`;
    const result = generator.generateValue(value);

    expectHtmlEqual(result, expected);
  });

  it('should generate a value with no description', () => {
    const value = { name: 'weekdays' };
    const generator = new EnumsGenerator({}, []);
    const expected = `
      <div class="flex my2 table-row">
        <div class="value-name col-2 mr3 right-align">weekdays</div>
        <div class="value-desc flex-auto"></div>
      </div> `;
    const result = generator.generateValue(value);

    expectHtmlEqual(result, expected);
  });

  it('should generate an enum section', () => {
    const enumerator = {
      name: 'calendar',
      description: 'calendar description',
      values: [
        {
          name: 'weekdays',
          description: 'monday - friday',
        },
        {
          name: 'weekends',
          description: 'saturday & sunday',
        },
      ],
    };
    const docParts = [
      {
        type: 'enum',
        name: 'calendar',
        content: '\nSome information about calendars\n\n',
      },
    ];
    const generator = new EnumsGenerator({}, docParts);
    const expected = `
      <section class="header-block">
        <header id="type-calendar">
          <h3 class="h3">calendar</h3>
          <p>calendar description</p>
          <p>Some information about calendars</p>
        </header>
        <section class="values">
          <h5 class="h4">Values</h5>
          <div class="flex my2 table-row">
            <div class="value table-header col-2 mr3 right-align">Name</div>
            <div class="value-desc table-header flex-auto">Description</div>
          </div>
          <div class="flex my2 table-row">
            <div class="value-name col-2 mr3 right-align">weekdays</div>
            <div class="value-desc flex-auto">monday - friday</div>
          </div>
          <div class="flex my2 table-row">
            <div class="value-name col-2 mr3 right-align">weekends</div>
            <div class="value-desc flex-auto">saturday & sunday</div>
          </div>
        </section>
      </section>
    `;
    const result = generator.generateEnum(enumerator, docParts);

    expectHtmlEqual(result, expected);
  });

  it('should generate all enums', () => {
    const service = {
      enums: [
        {
          name: 'calendar',
          description: 'calendar description',
          values: [
            {
              name: 'weekdays',
              description: 'monday - friday',
            },
          ],
        },
        {
          name: 'colors',
          description: 'colors',
          values: [
            {
              name: 'blue',
              description: 'blue',
            },
          ],
        },
      ],
    };
    const generator = new EnumsGenerator(service, []);
    const expected = `
      <section>
        <header>
          <h2 class="h2">Enums</h2>
        </header>
        <section class="header-block">
          <header id="type-calendar">
            <h3 class="h3">calendar</h3>
            <p>calendar description</p>
          </header>
          <section class="values">
            <h5 class="h4">Values</h5>
            <div class="flex my2 table-row">
              <div class="value table-header col-2 mr3 right-align">Name</div>
              <div class="value-desc table-header flex-auto">Description</div>
            </div>
            <div class="flex my2 table-row">
              <div class="value-name col-2 mr3 right-align">weekdays</div>
              <div class="value-desc flex-auto">monday - friday</div>
            </div>
          </section>
        </section>
        <section class="header-block">
          <header id="type-colors">
            <h3 class="h3">colors</h3>
            <p>colors</p>
          </header>
          <section class="values">
            <h5 class="h4">Values</h5>
            <div class="flex my2 table-row">
              <div class="value table-header col-2 mr3 right-align">Name</div>
              <div class="value-desc table-header flex-auto">Description</div>
            </div>
            <div class="flex my2 table-row">
              <div class="value-name col-2 mr3 right-align">blue</div>
              <div class="value-desc flex-auto">blue</div>
            </div>
          </section>
        </section>
      </section>`;
    const result = generator.generate();

    expectHtmlEqual(result, expected);
  });
});
