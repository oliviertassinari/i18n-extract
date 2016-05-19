import {assert} from 'chai';
import forbidDynamic from './forbidDynamic.js';

describe('#forbidDynamic()', () => {
  describe('simple case', () => {
    it('should report forbidden dynamic key', () => {
      const missing = forbidDynamic({}, ['key1.*', '*.key2']);

      assert.deepEqual([
        {
          type: 'FORBID_DYNAMIC',
          key: 'key1.*',
        },
        {
          type: 'FORBID_DYNAMIC',
          key: '*.key2',
        },
      ], missing, 'Should report forbidden dynamic key.');
    });

    it('should no report static key', () => {
      const missing = forbidDynamic({}, ['key1', 'key2']);

      assert.deepEqual([], missing, 'Should not report static key.');
    });
  });
});
