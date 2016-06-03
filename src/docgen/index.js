import resources from './resources';
import models from './models';
import unions from './unions';
import enums from './enums';
import navigation from './navigation';

export function generate(service, additionalDocs = []) {
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
        ${navigation.generate(service)}
        <section class="p2 main-content">
          <h1 class="h1">${service.name}</h1>
          <p class="service-description">${service.description}</p>
          ${resources.generate(service.resources, additionalDocs)}
          ${models.generate(service.models, additionalDocs)}
          ${enums.generate(service.enums, additionalDocs)}
          ${unions.generate(service.unions, additionalDocs)}
        </section>
      </main>
      <script src="index.js"></script>
    </body>
  </html>
  `;
}

export default { generate };
