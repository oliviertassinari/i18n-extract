import glob from 'glob';
import fs from 'fs';

import {uniq} from './utils';
import extractFromCode from './extractFromCode';

export default function extractFromFiles(filenames, options) {
  let messages = [];

  // filenames should be an array
  if (typeof filenames === 'string') {
    filenames = [
      filenames,
    ];
  }

  let filenamesToScan = [];

  filenames.forEach((filename) => {
    filenamesToScan = filenamesToScan.concat(glob.sync(filename, {}));
  });

  filenamesToScan.forEach((filename) => {
    const code = fs.readFileSync(filename, 'utf8');
    messages = messages.concat(extractFromCode(code, options));
  });

  return uniq(messages);
}
