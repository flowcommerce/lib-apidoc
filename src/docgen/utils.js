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
