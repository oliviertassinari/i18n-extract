/* eslint-env mocha */

import { assert } from 'chai';
import extractFromFiles from './extractFromFiles.js';

describe('#extractFromFiles()', () => {
  it('should work when scanning with a glob and a string parameter', () => {
    const keys = extractFromFiles('src/extractFromFilesFixture/*View.js');

    assert.deepEqual([
      'key1',
      'key2',
      'key3',
    ], keys, 'Should find all the key without duplication');
  });

  it('should work when scanning with an array as parameter', () => {
    const keys = extractFromFiles([
      'src/extractFromFilesFixture/*.jsx',
      'src/extractFromFilesFixture/*.js',
    ]);

    assert.deepEqual([
      'key3',
      'key4',
      'key1',
      'key2',
    ], keys, 'Should work with an array as first parameter');
  });
});
