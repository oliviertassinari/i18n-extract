import glob from 'glob';
import fs from 'fs';
import extractFromCode from './extractFromCode';

export default function extractFromFiles(filenames, options) {
  const keys = [];

  // filenames should be an array
  if (typeof filenames === 'string') {
    filenames = [filenames];
  }

  let toScan = [];

  filenames.forEach(filename => {
    toScan = toScan.concat(glob.sync(filename, {}));
  });

  toScan.forEach(filename => {
    const code = fs.readFileSync(filename, 'utf8');
    const extractedKeys = extractFromCode(code, options);
    extractedKeys.forEach(keyObj => {
      keyObj.file = filename;
      keys.push(keyObj);
    });
  });

  return keys;
}
