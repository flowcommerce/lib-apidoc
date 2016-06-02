# lib-apidoc
Code and Document Generators for apidoc

## Install

    npm install @flowio/lib-apidoc

## docgen

Generates pretty API documentation for a service from its service JSON document
provided by [apidoc.me](http://www.apidoc.me).

Only outputs the HTML, with some assumptions on the location of the css and
javascript assets

### Usage
```JavaScript
    import fs from 'fs';
    import path from 'path';
    import { docgen } from '@flowio/lib-apidoc';

    const apiJson = fs.readFileSync(path.join(process.cwd(), 'service.json'));
    const markup = docgen.generate(fulfillment);

    fs.writeFile(path.join(process.cwd(), 'dist/index.html'));
```
### API
```JavaScript
    generate(service, additionalDocumentation = [])
```
- **service** - Object - JSON representation of a service. The `service.json`
provided by apidoc
- **additionalDocumentation** - Array - List of DocParts created by `docparse`.
Will inject additional documentation in the appropriate place in generated
documentation.


## docparse

Parses markdown files for supplementary documentation for the service json parsed by
`docgen`.

Example file:

    #doc:resource bookings

    Bookings are... and they're used for...

    #doc:resource:operation GET /bookings/versions

    Some documentation about `/bookings/versions`.

    Here are some bullet points

    - one
    - two
    - three

    #doc:resource:operation GET /bookings

    Some documentation about `/bookings`.

### Syntax

`DocParts` are a line that starts with `#doc:`. The full syntax is:

    #doc:<type> [<type specific data>]

Valid types are:

- **resource** - `resource <resource_name>`
- **resource:operation** - `resource:operation <method> <path>`
- **model** - `model <model_name>`
- **enum** - `enum <enum_name>`

### Usage
```JavaScript
    import fs from 'fs';
    import path from 'path';
    import { docgen, docparse } from '@flowio/lib-apidoc';

    const apiJson = fs.readFileSync(path.join(process.cwd(), 'service.json'));

    docparse
      .parse('doc/*.md')
      .then((docParts) => {
        const markup = docgen.generate(fulfillment);
        fs.writeFile(path.join(process.cwd(), 'dist/index.html'));
      });
```
