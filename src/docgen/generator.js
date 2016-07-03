import marked from 'marked';
import NavigationGenerator from './navigation';
import { linkType as utilLinkType } from './utils';

export default class Generator {
  constructor(service, additionalDocs) {
    this.service = service;
    this.docs = additionalDocs;
  }

  isType(type) {
    const cleanedType = type.replace('[', '').replace(']', '');
    return !!(this.service.models.find((m) => m.name === cleanedType)
      || this.service.enums.find((m) => m.name === cleanedType)
      || this.service.unions.find((m) => m.name === cleanedType));
  }

  linkType(type) {
    if (this.isType(type)) {
      return utilLinkType(type);
    }

    return type;
  }

  contentByType(type, name) {
    const doc = this.docs
      .find((d) => d.type === type && d.name.toLowerCase() === name.toLowerCase());

    if (doc) {
      return `
        ${marked(doc.content)}
      `;
    }

    return '';
  }

  htmlDocument(body) {
    const navigationGenerator = new NavigationGenerator(this.service, this.docs);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Flow Commerce API Reference</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width" />
          <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300' rel='stylesheet' type='text/css'>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.min.css" rel="stylesheet">
          <link href="https://npmcdn.com/basscss@8.0.1/css/basscss.min.css" rel="stylesheet">
          <link href="railscasts.css" rel="stylesheet">
          <link href="index.css" rel="stylesheet">
          <link rel="shortcut icon" type="image/png" href="/assets/0.0.1/img/favicon.ico">
        </head>
        <body>
          <main class="main flex">
            ${navigationGenerator.generate()}
            <section class="p2 main-content">
              ${body}
            </section>
          </main>
          <script src="highlight.pack.js"></script>
          <script src="index.js"></script>
          <script>hljs.initHighlightingOnLoad();</script>
        </body>
      </html>`;
  }
}
