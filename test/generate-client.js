import fs from 'fs';
import path from 'path';
import client from '../src/codegen/files/client';

const file = client.generate();

fs.writeFileSync(path.join('test/dist', file.path), file.contents);
