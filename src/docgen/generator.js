import NavigationGenerator from './navigation';

export default class Generator {
  constructor(service, additionalDocs) {
    this.service = service;
    this.docs = additionalDocs;
  }

  htmlDocument(body) {
    const navigationGenerator = new NavigationGenerator(this.service, this.docs);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'>
          <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300' rel='stylesheet' type='text/css'>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.min.css" rel="stylesheet">
          <link href="https://npmcdn.com/basscss@8.0.1/css/basscss.min.css" rel="stylesheet">
          <link href="index.css" rel="stylesheet">
        </head>
        <body>
          <main class="main flex">
            ${navigationGenerator.generate()}
            <section class="p2 main-content flex-auto">
              ${body}
            </section>
          </main>
          <script src="index.js"></script>
        </body>
      </html>`;
  }
}
