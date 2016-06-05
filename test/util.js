import { expect } from 'chai';
import { html } from 'js-beautify';

export function normalizeHtml(htmlStr) {
  const normalized = htmlStr
    .replace('\n', '')
    .replace(/\s+/g, ' ')
    .trim();

  return html(normalized, { indent_size: 2 });
}

export function expectHtmlEqual(expected, actual) {
  expect(normalizeHtml(actual)).to.equal(normalizeHtml(expected));
}
