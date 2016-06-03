export default class Generator {
  constructor(service, additionalDocs) {
    this.service = service;
    this.docs = additionalDocs;
  }

  slug(string) {
    return string
      .replace(/[^a-zA-Z0-9\-_\s]/gi, '')
      .replace(/(\s+|_)/gi, '-')
      .toLowerCase();
  }

  linkType(type) {
    let normalizedType = type;

    if (type.startsWith('[')) {
      normalizedType = type.replace('[', '').replace(']', '');
    }

    return type.replace(
      normalizedType,
      `<a href="types.html#type-${this.slug(normalizedType)}">${normalizedType}</a>`
    );
  }

  getModelByType(type) {
    return this.service.models.find((m) => m.name === type);
  }
}
