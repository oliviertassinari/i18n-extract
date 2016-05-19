import {assert} from 'chai';
import findMissing from './findMissing.js';

describe('#findMissing()', () => {
  describe('static keys', () => {
    it('should work with a simple case', () => {
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

  describe('dynamic keys', () => {
    it('should work with a simple case', () => {
      const missing = findMissing({
        'foo.key1': 'Key 1',
        'foo.key2': 'Key 2',
        'bar': 'Key 3',
        'foo.key.bar': 'Key 4',
      }, ['foo.*', '*.key1', '*', 'foo.*.bar']);

      assert.deepEqual([], missing, 'Should report zero missing key.');
    });

    it('should work with a simple case', () => {
      const missing = findMissing({
        'bar.key1': 'Key 1',
        'bar.key.foo': 'Key 1',
        'foo': 'Key 2',
      }, ['foo.*', '*.key2', 'bar.*.foo1']);

      assert.deepEqual([
        {
          key: 'foo.*',
          type: 'MISSING',
        },
        {
          key: '*.key2',
          type: 'MISSING',
        },
        {
          key: 'bar.*.foo1',
          type: 'MISSING',
        },
      ], missing, 'Should report three missing key.');
    });

    it('should do an exact match even with dynamic keys', () => {
      const missing = findMissing({
        'bar.key.foo': 'Key 1',
      }, ['key.*']);

      assert.deepEqual([
        {
          key: 'key.*',
          type: 'MISSING',
        },
      ], missing, 'Should report one missing key.');
    });
  });
});

