/* eslint-env mocha */

import { assert } from 'chai';
import findDuplicated from './findDuplicated.js';

describe('#findDuplicated()', () => {
  it('should report one duplicated key', () => {
    const duplicated = findDuplicated({
      key1: 'Key 1',
      key2: 'Key 2',
      key3: 'Key 2',
    });

    assert.deepEqual(
      [
        {
          type: 'DUPLICATED',
          keys: ['key2', 'key3'],
          value: 'Key 2',
        },
      ],
      duplicated,
      'Should report one duplicated key.',
    );
  });

  it('should report two duplicated keys', () => {
    const duplicated = findDuplicated({
      key1: 'Key 1',
      key2: 'Key 2',
      key3: 'Key 2',
      key4: 'Key 2',
    });

    assert.deepEqual(
      [
        {
          type: 'DUPLICATED',
          keys: ['key2', 'key3', 'key4'],
          value: 'Key 2',
        },
      ],
      duplicated,
      'Should report two duplicated keys.',
    );
  });

  describe('option: threshold', () => {
    it('should report zero duplicated key', () => {
      const duplicated = findDuplicated(
        {
          key1: 'Key 1',
          key2: 'Key 2',
          key3: 'Key 2',
          key4: 'Key 2',
        },
        [],
        {
          threshold: 3,
        },
      );

      assert.deepEqual([], duplicated, 'Should report zero duplicated key.');
    });

    it('should report two duplicated keys', () => {
      const duplicated = findDuplicated(
        {
          key1: 'Key 1',
          key2: 'Key 2',
          key3: 'Key 2',
          key4: 'Key 2',
        },
        [],
        {
          threshold: 2,
        },
      );

      assert.deepEqual(
        [
          {
            type: 'DUPLICATED',
            keys: ['key2', 'key3', 'key4'],
            value: 'Key 2',
          },
        ],
        duplicated,
        'Should report two duplicated keys.',
      );
    });
  });
});
