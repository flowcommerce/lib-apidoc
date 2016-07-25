import fs from 'fs';
import path from 'path';
import service from './codegen/fulfillment.service.json';
import apidoc from '../src';

const clientBasePath = path.join(__dirname, './dist');
const client = apidoc.codegen.generate(service);

console.log('[flow/api] writing client files...');
client.files.forEach((file) => {
  fs.writeFileSync(path.join(clientBasePath, file.path), file.contents);
});
