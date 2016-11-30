import codegen from './src/codegen';
import apiInternalJson from './api-internal.json';
import fs from 'fs';
import path from 'path';

function ensureDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw new Error(e.message);
    }
  }
}

function generateClient(service) {
  const serviceJsonString = JSON.stringify(service, null, 2);
  const clientBasePath = path.join(__dirname, 'dist/clients');
  const client = codegen.generate(service);

  ensureDir(clientBasePath);
  console.log('[flow/api] writing service.json...');
  fs.writeFileSync(path.join(clientBasePath, 'service.json'), serviceJsonString);

  console.log('[flow/api] writing client files...');
  client.files.forEach((file) => {
    console.log(`           ${file.path}`);
    fs.writeFileSync(path.join(clientBasePath, file.path), file.contents);
  });
}

generateClient(apiInternalJson);
