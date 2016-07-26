import fs from 'fs';

/**
 * Eat the expection if a file is not found and return undefined instead.
 */
export function maybeGetFileContents(filePath) {
  try {
    return fs.readFileSync(filePath).toString('utf-8');
  } catch (e) {
    return void 0;
  }
}

export function getMarkdownCodeBlock(content, lang = '') {
  if (typeof content === 'undefined') {
    return '';
  }

  const MD_BEGIN_BLOCK = '```';
  const MD_END_BLOCK = '```';

  return `${MD_BEGIN_BLOCK}${lang}
${content.trim()}
${MD_END_BLOCK}
`;
}

export function getCurlCommandFromOperation(operation, queryString) {
  const method = operation.method.toUpperCase();
  const path = operation.path;
  const search = queryString ? `?${queryString}` : '';
  const uri = queryString ? `'https://api.flow.io${path}${search}'` : `https://api.flow.io${path}${search}`;

  switch (method) {
  case 'GET':
    return `curl -u &lt;api-token&gt;: ${uri}`;
  default:
    return `curl -X ${method} -d @body.json -u &lt;api-token&gt;: ${uri}`;
  }
}

export function slug(string) {
  return string
    .replace(/[^a-zA-Z0-9\-_\s]/gi, '-')
    .replace(/_+/gi, '-')
    .replace(/\s+/gi, '-')
    .replace(/\-+/gi, '-')
    .replace(/^\-/, '')
    .replace(/\-$/, '')
    .toLowerCase();
}

export function slugToLabel(str) {
  return slug(str).replace(/\-/g, ' ');
}

export function linkType(type) {
  let normalizedType = type;

  if (!type) {
    return '';
  }

  if (type.startsWith('[')) {
    normalizedType = type.replace('[', '').replace(']', '');
  }

  return type.replace(
    normalizedType,
    `<a href="types.html#type-${slug(normalizedType)}">${normalizedType}</a>`
  );
}

export function getDocAttributeModule(attributes = []) {
  const docs = attributes.find((a) => a.name === 'docs');
  if (docs && docs.value && docs.value.module) {
    return docs.value.module;
  }

  return null;
}

export function getOrderedModules(resources) {
  let ordering = [];
  resources.forEach((resource) => {
    const module = getDocAttributeModule(resource.attributes);
    if (!module) {
      throw new Error(`Expected resource[${resource.plural}] to have a docs.value.module attribute.`); // eslint-disable-line max-len
    }

    if (!ordering.includes(module)) {
      ordering = ordering.concat(module);
    }
  });

  return ordering;
}

export default { slug, linkType, getDocAttributeModule, getOrderedModules };
