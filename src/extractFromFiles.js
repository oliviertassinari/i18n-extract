import glob from 'glob';
import fs from 'fs';

import {uniq} from './utils';
import extractFromCode from './extractFromCode';

export default function extractFromFiles(filenames, options) {
  let keys = [];

  // filenames should be an array
  if (typeof filenames === 'string') {
    filenames = [
      filenames,
    ];
  }

  let toScan = [];

  filenames.forEach((filename) => {
    toScan = toScan.concat(glob.sync(filename, {}));
  });

  toScan.forEach((filename) => {
    const code = fs.readFileSync(filename, 'utf8');
    keys = keys.concat(extractFromCode(code, options));
  });

  return uniq(keys);
}
