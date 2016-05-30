/* global describe, it */
import path from 'path';
import { expect } from 'chai';

import { loadTemplate } from '../../../src/codegen/util/handlebars';


describe('util.handlebars', () => {
  it('load renderable template', () => {
    const tpl = loadTemplate(path.join(__dirname, 'template.hbs'));

    expect(tpl).to.be.a('function');

    const rendered = tpl({ value: 'hello' });

    expect(rendered).to.be.a('string');
    expect(rendered).to.equal(`This is a template.

It should display this hello.

The end.
`);
  });
});
