import {assert} from 'chai';
import findUnused from './findUnused.js';

describe('#findUnused()', () => {
  describe('static keys', () => {
    it('should work with a simple case', () => {
      const unused = findUnused({
        key1: 'Key 1',
        key2: 'Key 2',
      }, ['key1', 'key2']);

      assert.deepEqual([], unused, 'Should report zero unused key.');
    });

    it('should work with a simple case', () => {
      const unused = findUnused({
        key1: 'Key 1',
        key2: 'Key 2',
        key4: 'Key 4',
      }, ['key1', 'key2']);

      assert.deepEqual([
        {
          type: 'UNUSED',
          key: 'key4',
        },
      ], unused, 'Should report one unused key.');
    });
  });
});
