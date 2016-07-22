# lib-apidoc

Code and Document Generators for apidoc

## Requirements

- **apidoc** - This library depends on data from apidoc - [http://www.apidoc.me](http://www.apidoc.me). An api hosted here generates a `service.json` file. The JSON representation of the service.

## Installation

```bash
npm install --save-dev @flowio/lib-apidoc
```

## API Reference

### `codegen`

#### Methods

The methods listed below can be accessed from `codegen`.

- `generate(service: Object): Array`

  The argument passed to the `generate` function is:

  - `service: Object`: JSON representation of a service. The `service.json` provided by apidoc

### `docgen`

Generates pretty API documentation for a service from its service JSON document provided by [apidoc.me](http://www.apidoc.me).

This function only outputs the HTML, with some assumptions on the location of the css and javascript assets.

#### Usage

```javascript
import fs from 'fs';
import path from 'path';
import { docgen } from '@flowio/lib-apidoc';

const apiJson = fs.readFileSync(path.join(process.cwd(), 'service.json'));
const markup = docgen.generate(fulfillment);

fs.writeFile(path.join(process.cwd(), 'dist/index.html'));
```

#### Methods

The methods listed below can be accessed from `docgen`.

- `generate(service: Object[, options: Object]): Array`

  The two arguments passed to the `generate` function are:

  - `service: Object`: JSON representation of a service. The `service.json` provided by apidoc.

  - `options: Object`: If specified, further customizes the behavior of the generator.

    - `additionalDocumentation: Array`: List of DocParts created by `docparse`. Will inject additional documentation in the appropriate place in generated documentation. Defaults to an empty Array.

    - `examplePath: String` - The location for request/response examples. Will inject request and responses examples in the appropriate place in generated documentation.

### `docparse`

Parses markdown files for supplementary documentation for the service JSON parsed by `docgen`.

#### Example File

```markdown
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
```

#### Syntax

`DocParts` are a line that starts with `#doc:`. The full syntax is:

```
#doc:<type> [<type specific data>]
```

Valid types are:

- **resource** - `resource <resource_name>` - the 'plural' name of the resource from service.json

- **resource:operation** - `resource:operation <method> <path>` - the method (GET, POST, etc) and operation path. Must match exactly as defined in the service.json.

- **model** - `model <model_name>`

- **enum** - `enum <enum_name>`

#### Usage

```javascript
import fs from 'fs';
import path from 'path';
import { docgen, docparse } from '@flowio/lib-apidoc';

const apiJson = fs.readFileSync(path.join(process.cwd(), 'service.json'));

docparse.parse('doc/*.md').then((docParts) => {
  const markup = docgen.generate(fulfillment);
  fs.writeFile(path.join(process.cwd(), 'dist/index.html'));
});
```

#### Methods

The methods listed below can be accessed from `docparse`.

- `parse(glob: String)`

  - `glob: String`: A [glob](https://www.npmjs.com/package/glob) for files to parse
