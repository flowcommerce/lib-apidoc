import resources from './resources';

export function generate(service) {
  return `
  <DOCTYPE html>
  <html>
    <head>
      <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed' rel='stylesheet' type='text/css'>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.min.css" rel="stylesheet">
      <link href="https://npmcdn.com/basscss@8.0.1/css/basscss.min.css" rel="stylesheet">
      <link href="index.css" rel="stylesheet">
    </head>
    <body>
      <section class="p2">
        <h1 class="h1">${service.name}</h1>
        <p class="service-description">${service.description}</p>
        ${resources.generate(service.resources)}
      </section>
    </body>
  </html>
  `;
}

export default { generate };
