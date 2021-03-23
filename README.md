# lib-apidoc

> Create JavaScript apidoc clients

![Travis Build](https://travis-ci.com/flowcommerce/lib-apidoc.svg?token=7zKwz4c4Spi2bnQ6UDw6&branch=main "Travis Build")
[![npm version](https://badge.fury.io/js/%40flowio%2Flib-apidoc.svg)](https://badge.fury.io/js/%40flowio%2Flib-apidoc)

Code generator for apidoc that will take in an object representing an apidoc service and return a list of objects representing files for the client.

The generated code is isomorphic, depending on a native `fetch` implementation
in the browser and `node-fetch` in a node.js environment.

## Requirements

- **apidoc** - This library depends on data from apidoc - [http://www.apidoc.me](http://www.apidoc.me). An api hosted here generates a `service.json` file - the JSON representation of the service.
- **node-fetch** - In a node.js environment the generated code depends on - [https://www.npmjs.com/package/node-fetch](https://www.npmjs.com/package/node-fetch)

## Installation

```bash
npm install --save-dev @flowio/lib-apidoc
```

## Usage

A basic example of generating a JavaScipt client from an apidoc service.

```JavaScript
import fs from 'fs';
import path from 'path';
import service from './service.json';
import { codegen } from '@flowio/lib-apidoc';

const clientBasePath = path.join(__dirname, './dist');
const client = codegen.generate(service);

client.files.forEach((file) => {
  fs.writeFileSync(path.join(clientBasePath, file.path), file.contents);
});
```

## API Reference

### codegen

#### Methods

The methods listed below can be accessed from `codegen`.

`generate(service: Object, options: Object): Array`

The argument passed to the `generate` function is:

- `service` - JSON representation of a service. The `service.json` provided by apidoc
- `options`
  - `clientImportPath` - path to where generated client.js file will be located relative to service resource js files. Default is `.` (the current directory).

Returns an array of file objects that have this shape:

```JavaScript
{
  contents: "import Client from './client'\nexport default class Resource...",
  path: 'resource.js'
}
```

## Generated Code

By default lib-apidoc will take in a service json object and return a list of
objects representing files.

### Directory Layout

If you write all of the files based on their `path` property you will end up with a directory structure that looks like the below.

| Path              | Description
| ----------------- | -----------
| `./client.js`     | Class that handles bootstrapping a client and http (via `fetch`) request / response handling
| `./index.js`      | The entrypoint to the client
| `./logger.js`     | Logging utility
| `./resource_1.js` | A service resource that would be located at (in service.json): `.resources[plural=resource_1]`
| `./resource_2.js` | A service resource that would be located at (in service.json): `.resources[plural=resource_2]`
| `./resource_3.js` | A service resource that would be located at (in service.json): `.resources[plural=resource_3]`

### Client Usage

Example creating a module that exposes a function to create an instance of a
client with a default value for the api host.

```JavaScript
import Client from './client';

export default function CreateClient(opts) {
  let options = {
    host: 'https://api.example.com',
  };

  if (typeof opts === 'string') {
    options.auth = opts;
  } else {
    options = Object.assign({}, options, opts);
  }

  return new Client(options);
}
```

**Options**

| Name          | Type   |  Description                       
| ------------- | -----  | ---------------------------------
| host          | String | The http host / uri of the api    
| auth          | String | Converted to a Basic Authorization
| auth          | Object | Basic or Bearer authorization     
| -- auth.type  | String | One of: `basic`, `bearer`, `jwt`. bearer and jwt are synonymous with each other
| -- auth.value | String | The value of the Authorization header
| headers       | Object | Headers to be passed with all http requests from the client
| serviceName   | String | The name of the service (currently unused)

### Resource Usage

```JavaScript
import Client from './client'

const client = new Client({ host: 'https://api.example.com' })

// Example of using the 'get' operation on the 'users' resource.
client.users.get().then((response) => {
  switch(response.status) {
    case 200:
      response.result.map((user) =>
        console.log(`Found User: ${user.email}`))
    case 401:
      throw new Error('Was not authorized to get users!')
    default:
      throw new Error(`Response code[${response.status}] not handled!`)
  }
})
```

**Options**

All options mentioned above in the client usage and any `fetch` options can be
provided as the only or last parameter to a resource operation.


## Contributing / Issues / Questions

If you would like to contribute to lib-apidoc, have any bugs to report or have general questions, please see our [contributing guidelines](CONTRIBUTING.md).

## License

[MIT](LICENSE)
