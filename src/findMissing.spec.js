import {assert} from 'chai';
import findMissing from './findMissing.js';

describe('#findMissing()', () => {
  it('should report one missing key', () => {
    const missing = findMissing({
      key1: 'Key 1',
      key2: 'Key 2',
    }, ['key1', 'key2', 'key3']);

    assert.deepEqual([
      {
        type: 'MISSING',
        key: 'key3',
      },
    ], missing, 'Should report one missing key.');
  });
});

