import {assert} from 'chai';
import fs from 'fs';
import path from 'path';
import extractFromCode from './extractFromCode.js';

function getCode(name) {
  return fs.readFileSync(path.join(__dirname, `extractFromCodeFixtures/${name}`), 'utf8');
}

describe('#extractFromCode()', () => {
  it('should return the right messages with ES5 code', () => {
    const messages = extractFromCode(getCode('es5.js'));

    assert.deepEqual([
      'follow',
      'followed',
      'unfollowed',
      'unfollow',
      'following',
    ], messages, 'Should work with ES5 code.');
  });

  it('should return the right messages with ES6 code', () => {
    const messages = extractFromCode(getCode('es6.js'));

    assert.deepEqual([
      'reset',
      'revert',
      'sweep',
      'commit',
    ], messages, 'Should work with ES6 code.');
  });

  it('should return the right messages with a custom marker', () => {
    const messages = extractFromCode(getCode('marker.js'), {
      marker: '__',
    });

    assert.deepEqual([
      'this_is_a_custom_marker',
    ], messages, 'Should take into account the marker option.');
  });

  it('should return the right messages with multiple arguments', () => {
    const messages = extractFromCode(getCode('many-args.js'));

    assert.deepEqual([
      'hello_username',
    ], messages, 'The second argument shoudn\'t have any impact.');
  });

  it('should deduplicate the keys', () => {
    const messages = extractFromCode(getCode('duplicated.js'));

    assert.deepEqual([
      'key',
    ], messages, 'Should return only one element.');
  });
});
