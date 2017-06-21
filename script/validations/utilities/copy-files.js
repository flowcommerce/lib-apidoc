import fs from 'fs';
import path from 'path';

/**
 * Note this is inefficient. To avoid using callbacks for relatively small
 * files this code is synchronous.
 */
export default function copyFiles(files = [], destinationDirectory) {
  if (!destinationDirectory) {
    throw new Error('[copyFiles] destination is required');
  }

  files.forEach((file) => {
    const srcContent = fs.readFileSync(file, 'UTF-8');
    const fileName = file.substring(file.lastIndexOf('/') + 1);
    fs.writeFileSync(path.resolve(`${destinationDirectory}/${fileName}`), srcContent);
  });
}
