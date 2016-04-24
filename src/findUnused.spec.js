import {assert} from 'chai';
import findUnused from './findUnused.js';

describe('#findUnused()', () => {
  it('should report one unused key', () => {
    const unused = findUnused({
      key1: 'Key 1',
      key2: 'Key 2',
      key4: 'Key 4',
    }, ['key1', 'key2', 'key3']);

    assert.deepEqual([
      {
        type: 'UNUSED',
        key: 'key4',
      },
    ], unused, 'Should report one unused key.');
  });
});
