/* eslint-env mocha */

import { assert } from 'chai';
import findUnused from './findUnused.js';

describe('#findUnused()', () => {
  describe('static keys', () => {
    it('should work with a simple case', () => {
      const unused = findUnused(
        {
          key1: 'Key 1',
          key2: 'Key 2',
        },
        [{ key: 'key1', loc: null }, { key: 'key2', loc: null }],
      );

      assert.deepEqual([], unused, 'Should report zero unused key.');
    });

    it('should work with a simple case', () => {
      const unused = findUnused(
        {
          key1: 'Key 1',
          key2: 'Key 2',
          key3: 'Key 3',
        },
        [{ key: 'key1', loc: null }, { key: 'key2', loc: null }],
      );

      assert.deepEqual(
        [
          {
            type: 'UNUSED',
            key: 'key3',
          },
        ],
        unused,
        'Should report one unused key.',
      );
    });
  });

  describe('dynamic keys', () => {
    it('should work with a simple case', () => {
      const unused = findUnused(
        {
          'foo.key1': 'Key 1',
          'foo.key2': 'Key 2',
        },
        [{ key: 'foo.*', loc: null }],
      );

      assert.deepEqual([], unused, 'Should report zero unused key.');
    });

    it('should work with a simple case', () => {
      const unused = findUnused(
        {
          'foo.key1': 'Key 1',
          'foo.key2': 'Key 2',
          key3: 'Key 3',
        },
        [{ key: 'foo.*', loc: null }],
      );

      assert.deepEqual(
        [
          {
            type: 'UNUSED',
            key: 'key3',
          },
        ],
        unused,
        'Should report one unused key.',
      );
    });

    it('should do an exact match even with dynamic keys', () => {
      const missing = findUnused(
        {
          'bar.key.foo': 'Key 1',
        },
        [{ key: 'key.*', loc: null }],
      );

      assert.deepEqual(
        [
          {
            key: 'bar.key.foo',
            type: 'UNUSED',
          },
        ],
        missing,
        'Should report one missing key.',
      );
    });

    it('should ignore * only keys', () => {
      const missing = findUnused(
        {
          'foo.key1': 'Key 1',
          'foo.key2': 'Key 2',
        },
        [{ key: '*', loc: null }, { key: 'foo.key1', loc: null }],
      );

      assert.deepEqual(
        [
          {
            key: 'foo.key2',
            type: 'UNUSED',
          },
        ],
        missing,
        'Should report one missing key.',
      );
    });
  });
});
