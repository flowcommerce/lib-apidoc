import crypto from 'crypto';
import { expect } from 'chai';
import fs from 'fs';
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

export function createRandomTmpFile() {
  const random = crypto.randomBytes(48).toString('hex');
  const path = `/tmp/lib_apidoc_test_file_${random}`;
  fs.writeFileSync(path, path);
  return path;
}
