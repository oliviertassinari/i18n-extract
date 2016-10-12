/* eslint-env mocha */

import { assert } from 'chai';
import fs from 'fs';
import path from 'path';
import extractFromCode from './extractFromCode.js';

function getCode(name) {
  return fs.readFileSync(path.join(__dirname, `extractFromCodeFixtures/${name}`), 'utf8');
}

describe('#extractFromCode()', () => {
  describe('static keys', () => {
    it('should return the right keys with ES5 code', () => {
      const keys = extractFromCode(getCode('es5.js'));

      assert.deepEqual([
        'follow',
        'followed',
        'unfollowed',
        'unfollow',
        'following',
      ], keys, 'Should work with ES5 code.');
    });

    it('should return the right keys with ES6 code', () => {
      const keys = extractFromCode(getCode('es6.js'));

      assert.deepEqual([
        'reset',
        'revert',
        'sweep',
        'commit',
      ], keys, 'Should work with ES6 code.');
    });

    it('should return the right keys with a custom marker', () => {
      const keys = extractFromCode(getCode('marker.js'), {
        marker: '__',
      });

      assert.deepEqual([
        'this_is_a_custom_marker',
      ], keys, 'Should take into account the marker option.');
    });

    it('should return the right keys with a composed custom marker', () => {
      const keys = extractFromCode(getCode('markerComposed.js'), {
        marker: 'polyglot.t',
      });

      assert.deepEqual([
        'this_is_a_custom_marker',
      ], keys, 'Should take into account the marker option.');
    });

    it('should return the right keys with multiple arguments', () => {
      const keys = extractFromCode(getCode('many-args.js'));

      assert.deepEqual([
        'hello_username',
      ], keys, 'The second argument shoudn\'t have any impact.');
    });

    it('should deduplicate the keys', () => {
      const keys = extractFromCode(getCode('duplicated.js'));

      assert.deepEqual([
        'key',
      ], keys, 'Should return only one key.');
    });

    it('should return the right key with literal template', () => {
      const keys = extractFromCode(getCode('template.js'));

      assert.deepEqual([
        'key',
      ], keys, 'Should return only one key.');
    });

    it('should return the right key with a function call', () => {
      const keys = extractFromCode(getCode('function.js'));

      assert.deepEqual([
        '*',
      ], keys, 'Should return one key.');
    });

    it('should return the right key with a member expression', () => {
      const keys = extractFromCode(getCode('memberExpression.js'));

      assert.deepEqual([
        '*',
      ], keys, 'Should return one key.');
    });
  });

  describe('dynamic keys', () => {
    let keys;

    it('should return the right key with a concat', () => {
      keys = extractFromCode(getCode('dynamicConcat.js'));
    });

    it('should return the right key with a template', () => {
      keys = extractFromCode(getCode('dynamicTemplate.js'));
    });

    afterEach(() => {
      assert.deepEqual([
        'key.*',
        'key.*.bar',
        '*.bar',
        '*',
      ], keys, 'Should return the right key.');
    });
  });

  describe('comment', () => {
    it('should return the keys when added as a comment', () => {
      const keys = extractFromCode(getCode('comment.js'));

      assert.deepEqual([
        'foo.bar1',
        'foo.bar2',
      ], keys, 'Should return the good keys.');
    });
  });
});
