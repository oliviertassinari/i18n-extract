/* eslint-env mocha */

import { assert } from 'chai';
import findMissing from './findMissing.js';

describe('#findMissing()', () => {
  describe('static keys', () => {
    it('should work with a simple case', () => {
      const missing = findMissing(
        {
          key1: 'Key 1',
          key2: 'Key 2',
        },
        [{ key: 'key1', loc: null }, { key: 'key2', loc: null }, { key: 'key3', loc: null }],
      );

      assert.deepEqual(
        [
          {
            type: 'MISSING',
            key: 'key3',
            loc: null,
          },
        ],
        missing,
        'Should report one missing key.',
      );
    });
  });

  describe('dynamic keys', () => {
    it('should work with a simple case', () => {
      const missing = findMissing(
        {
          'foo.key1': 'Key 1',
          'foo.key2': 'Key 2',
          bar: 'Key 3',
          'foo.key.bar': 'Key 4',
        },
        [
          { key: 'foo.*', loc: null },
          { key: '*.key1', loc: null },
          { key: '*', loc: null },
          { key: 'foo.*.bar', loc: null },
        ],
      );

      assert.deepEqual([], missing, 'Should report zero missing key.');
    });

    it('should work with a simple case', () => {
      const missing = findMissing(
        {
          'bar.key1': 'Key 1',
          'bar.key.foo': 'Key 1',
          foo: 'Key 2',
        },
        [
          { key: 'foo.*', loc: null },
          { key: '*.key2', loc: null },
          { key: 'bar.*.foo1', loc: null },
        ],
      );

      assert.deepEqual(
        [
          {
            key: 'foo.*',
            type: 'MISSING',
            loc: null,
          },
          {
            key: '*.key2',
            type: 'MISSING',
            loc: null,
          },
          {
            key: 'bar.*.foo1',
            type: 'MISSING',
            loc: null,
          },
        ],
        missing,
        'Should report three missing key.',
      );
    });

    it('should do an exact match even with dynamic keys', () => {
      const missing = findMissing(
        {
          'bar.key.foo': 'Key 1',
        },
        [{ key: 'key.*', loc: null }],
      );

      assert.deepEqual(
        [
          {
            key: 'key.*',
            type: 'MISSING',
            loc: null,
          },
        ],
        missing,
        'Should report one missing key.',
      );
    });
  });
});
