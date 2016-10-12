/* eslint-env mocha */

import { assert } from 'chai';
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
        key3: 'Key 3',
      }, ['key1', 'key2']);

      assert.deepEqual([
        {
          type: 'UNUSED',
          key: 'key3',
        },
      ], unused, 'Should report one unused key.');
    });
  });

  describe('dynamic keys', () => {
    it('should work with a simple case', () => {
      const unused = findUnused({
        'foo.key1': 'Key 1',
        'foo.key2': 'Key 2',
      }, ['foo.*']);

      assert.deepEqual([], unused, 'Should report zero unused key.');
    });

    it('should work with a simple case', () => {
      const unused = findUnused({
        'foo.key1': 'Key 1',
        'foo.key2': 'Key 2',
        key3: 'Key 3',
      }, ['foo.*']);

      assert.deepEqual([
        {
          type: 'UNUSED',
          key: 'key3',
        },
      ], unused, 'Should report one unused key.');
    });

    it('should do an exact match even with dynamic keys', () => {
      const missing = findUnused({
        'bar.key.foo': 'Key 1',
      }, ['key.*']);

      assert.deepEqual([
        {
          key: 'bar.key.foo',
          type: 'UNUSED',
        },
      ], missing, 'Should report one missing key.');
    });
  });
});
