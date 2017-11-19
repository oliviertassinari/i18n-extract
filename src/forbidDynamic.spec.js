/* eslint-env mocha */

import { assert } from 'chai';
import forbidDynamic from './forbidDynamic.js';

describe('#forbidDynamic()', () => {
  describe('simple case', () => {
    it('should report forbidden dynamic key', () => {
      const missing = forbidDynamic({}, [
        { key: 'key1.*', loc: null },
        { key: '*.key2', loc: null },
      ]);

      assert.deepEqual(
        [
          {
            type: 'FORBID_DYNAMIC',
            key: 'key1.*',
            loc: null,
          },
          {
            type: 'FORBID_DYNAMIC',
            key: '*.key2',
            loc: null,
          },
        ],
        missing,
        'Should report forbidden dynamic key.',
      );
    });

    it('should no report static key', () => {
      const missing = forbidDynamic({}, [{ key: 'key1', loc: null }, { key: 'key2', loc: null }]);

      assert.deepEqual([], missing, 'Should not report static key.');
    });
  });
});
