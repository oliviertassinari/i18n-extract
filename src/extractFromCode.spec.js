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

      assert.deepEqual(
        [
          {
            key: 'follow',
            loc: {
              end: {
                column: 34,
                line: 23,
              },
              start: {
                column: 20,
                line: 23,
              },
            },
          },
          {
            key: 'follow',
            loc: {
              end: {
                column: 35,
                line: 24,
              },
              start: {
                column: 21,
                line: 24,
              },
            },
          },
          {
            key: 'followed',
            loc: {
              end: {
                column: 63,
                line: 48,
              },
              start: {
                column: 47,
                line: 48,
              },
            },
          },
          {
            key: 'unfollowed',
            loc: {
              end: {
                column: 65,
                line: 67,
              },
              start: {
                column: 47,
                line: 67,
              },
            },
          },
          {
            key: 'unfollow',
            loc: {
              end: {
                column: 63,
                line: 142,
              },
              start: {
                column: 47,
                line: 142,
              },
            },
          },
          {
            key: 'following',
            loc: {
              end: {
                column: 83,
                line: 142,
              },
              start: {
                column: 66,
                line: 142,
              },
            },
          },
        ],
        keys,
        'Should work with ES5 code.',
      );
    });

    it('should return the right keys with ES6 code', () => {
      const keys = extractFromCode(getCode('es6.js'));

      assert.deepEqual(
        [
          {
            key: 'reset',
            loc: {
              end: {
                column: 26,
                line: 166,
              },
              start: {
                column: 13,
                line: 166,
              },
            },
          },
          {
            key: 'revert',
            loc: {
              end: {
                column: 27,
                line: 173,
              },
              start: {
                column: 13,
                line: 173,
              },
            },
          },
          {
            key: 'sweep',
            loc: {
              end: {
                column: 26,
                line: 180,
              },
              start: {
                column: 13,
                line: 180,
              },
            },
          },
          {
            key: 'commit',
            loc: {
              end: {
                column: 27,
                line: 187,
              },
              start: {
                column: 13,
                line: 187,
              },
            },
          },
        ],
        keys,
        'Should work with ES6 code.',
      );
    });

    it('should return the right keys with a custom marker', () => {
      const keys = extractFromCode(getCode('marker.js'), {
        marker: '__',
      });

      assert.deepEqual(
        [
          {
            key: 'this_is_a_custom_marker',
            loc: {
              end: {
                column: 56,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
        ],
        keys,
        'Should take into account the marker option.',
      );
    });

    it('should return the right keys with a custom keyLoc', () => {
      const keys = extractFromCode(getCode('marker.js'), {
        marker: '__',
        keyLoc: -1,
      });

      assert.deepEqual(
        [
          {
            key: 'this_is_a_custom_keyLoc',
            loc: {
              end: {
                column: 56,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
        ],
        keys,
        'Should take into account the marker option.',
      );
    });

    it('should return the right keys with a composed custom marker', () => {
      const keys = extractFromCode(getCode('markerComposed.js'), {
        marker: 'polyglot.t',
      });

      assert.deepEqual(
        [
          {
            key: 'this_is_a_custom_marker',
            loc: {
              end: {
                column: 37,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
        ],
        keys,
        'Should take into account the marker option.',
      );
    });

    it('should return the right keys with multiple arguments', () => {
      const keys = extractFromCode(getCode('many-args.js'));

      assert.deepEqual(
        [
          {
            key: 'hello_username',
            loc: {
              end: {
                column: 2,
                line: 11,
              },
              start: {
                column: 0,
                line: 9,
              },
            },
          },
        ],
        keys,
        "The second argument shoudn't have any impact.",
      );
    });

    it('should deduplicate the keys', () => {
      const keys = extractFromCode(getCode('duplicated.js'));

      assert.deepEqual(
        [
          {
            key: 'key',
            loc: {
              end: {
                column: 11,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
          {
            key: 'key',
            loc: {
              end: {
                column: 11,
                line: 6,
              },
              start: {
                column: 0,
                line: 6,
              },
            },
          },
        ],
        keys,
        'Should return only one key.',
      );
    });

    it('should return the right key with literal template', () => {
      const keys = extractFromCode(getCode('template.js'));

      assert.deepEqual(
        [
          {
            key: 'key',
            loc: {
              end: {
                column: 11,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
        ],
        keys,
        'Should return only one key.',
      );
    });

    it('should return the right key with a function call', () => {
      const keys = extractFromCode(getCode('function.js'));

      assert.deepEqual(
        [
          {
            key: '*',
            loc: {
              end: {
                column: 21,
                line: 7,
              },
              start: {
                column: 0,
                line: 7,
              },
            },
          },
        ],
        keys,
        'Should return one key.',
      );
    });

    it('should return the right key with a member expression', () => {
      const keys = extractFromCode(getCode('memberExpression.js'));

      assert.deepEqual(
        [
          {
            key: '*',
            loc: {
              end: {
                column: 24,
                line: 7,
              },
              start: {
                column: 0,
                line: 7,
              },
            },
          },
        ],
        keys,
        'Should return one key.',
      );
    });

    it('should return the right key with dynamic import in code', () => {
      const keys = extractFromCode(getCode('dynamicImport.js'));

      assert.deepEqual(
        [
          {
            key: 'key',
            loc: {
              end: {
                column: 11,
                line: 7,
              },
              start: {
                column: 0,
                line: 7,
              },
            },
          },
        ],
        keys,
        'Should return only one key.',
      );
    });
  });

  describe('dynamic keys', () => {
    let keys;

    it('should return the right key with a concat', () => {
      keys = extractFromCode(getCode('dynamicConcat.js'));

      assert.deepEqual(
        [
          {
            key: 'key.*',
            loc: {
              end: {
                column: 18,
                line: 8,
              },
              start: {
                column: 0,
                line: 8,
              },
            },
          },
          {
            key: 'key.*.bar',
            loc: {
              end: {
                column: 27,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
          {
            key: '*.bar',
            loc: {
              end: {
                column: 18,
                line: 14,
              },
              start: {
                column: 0,
                line: 14,
              },
            },
          },
          {
            key: '*',
            loc: {
              end: {
                column: 9,
                line: 17,
              },
              start: {
                column: 0,
                line: 17,
              },
            },
          },
        ],
        keys,
        'Should return the right key.',
      );
    });

    it('should return the right key with a template', () => {
      keys = extractFromCode(getCode('dynamicTemplate.js'));

      assert.deepEqual(
        [
          {
            key: 'key.*',
            loc: {
              end: {
                column: 18,
                line: 8,
              },
              start: {
                column: 0,
                line: 8,
              },
            },
          },
          {
            key: 'key.*.bar',
            loc: {
              end: {
                column: 22,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
          {
            key: '*.bar',
            loc: {
              end: {
                column: 18,
                line: 14,
              },
              start: {
                column: 0,
                line: 14,
              },
            },
          },
          {
            key: '*',
            loc: {
              end: {
                column: 14,
                line: 17,
              },
              start: {
                column: 0,
                line: 17,
              },
            },
          },
        ],
        keys,
        'Should return the right key.',
      );
    });
  });

  describe('include comment', () => {
    it('should return the keys when added as a comment', () => {
      const keys = extractFromCode(getCode('comment.js'));

      assert.deepEqual(
        [
          {
            key: 'foo.bar1',
            loc: {
              end: {
                column: 27,
                line: 3,
              },
              start: {
                column: 0,
                line: 3,
              },
            },
          },
          {
            key: 'foo.bar2',
            loc: {
              end: {
                column: 24,
                line: 4,
              },
              start: {
                column: 0,
                line: 4,
              },
            },
          },
          {
            key: 'foo.bar2',
            loc: {
              end: {
                column: 27,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
          {
            key: 'foo spaced1',
            loc: {
              end: {
                column: 30,
                line: 6,
              },
              start: {
                column: 0,
                line: 6,
              },
            },
          },
          {
            key: 'foo spaced2',
            loc: {
              end: {
                column: 27,
                line: 7,
              },
              start: {
                column: 0,
                line: 7,
              },
            },
          },
        ],
        keys,
        'Should return the good keys.',
      );
    });
  });

  describe('disable line comment', () => {
    it('should ignore the keys from a line disabled from comment', () => {
      const keys = extractFromCode(getCode('disable-comment.js'));

      assert.deepEqual(
        [
          {
            key: 'foo.bar1',
            loc: {
              end: {
                column: 16,
                line: 4,
              },
              start: {
                column: 0,
                line: 4,
              },
            },
          },
          {
            key: 'foo.bar3',
            loc: {
              end: {
                column: 16,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
        ],
        keys,
        'Should return the good keys.',
      );
    });
  });

  describe('ternary operator', () => {
    it('should parse ternary operator', () => {
      const keys = extractFromCode(getCode('ternaryOperator.js'));

      assert.deepEqual(
        [
          {
            key: '*',
            loc: {
              end: {
                column: 23,
                line: 8,
              },
              start: {
                column: 0,
                line: 8,
              },
            },
          },
          {
            key: 'bar',
            loc: {
              end: {
                column: 23,
                line: 8,
              },
              start: {
                column: 0,
                line: 8,
              },
            },
          },
          {
            key: '*',
            loc: {
              end: {
                column: 50,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
          {
            key: 'baz',
            loc: {
              end: {
                column: 50,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
          {
            key: 'bar',
            loc: {
              end: {
                column: 50,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
        ],
        keys,
        'Should return the good keys.',
      );
    });
  });

  describe('logical expression', () => {
    it('should parse logical expressions', () => {
      const keys = extractFromCode(getCode('logicalExpression.js'));

      assert.deepEqual(
        [
          {
            key: 'bar',
            loc: {
              end: {
                column: 18,
                line: 8,
              },
              start: {
                column: 0,
                line: 8,
              },
            },
          },
          {
            key: '*',
            loc: {
              end: {
                column: 18,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
          {
            key: 'baz',
            loc: {
              end: {
                column: 18,
                line: 11,
              },
              start: {
                column: 0,
                line: 11,
              },
            },
          },
          {
            key: 'bar',
            loc: {
              end: {
                column: 29,
                line: 14,
              },
              start: {
                column: 0,
                line: 14,
              },
            },
          },
          {
            key: 'baz',
            loc: {
              end: {
                column: 29,
                line: 14,
              },
              start: {
                column: 0,
                line: 14,
              },
            },
          },
        ],
        keys,
        'Should return the good keys.',
      );
    });
  });

  describe('ast parsing', () => {
    // See: https://github.com/oliviertassinari/i18n-extract/pull/62
    it('can handle nodes with a null loc attribute (SourceLocation)', () => {
      /**
       * This plugin will mutate the ast to add a new node.
       * The node created won't have an 'loc' (SourceLocation) attribute.
       *
       * According to https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md#node-objects,
       * that's fine, and we should be able to handle this.
       */
      function dynamicallyAddTranslation(babel) {
        const { types: t } = babel;
        return {
          visitor: {
            ImportDeclaration(p) {
              p.insertAfter(t.callExpression(t.identifier('__'), [t.stringLiteral('foo')]));
            },
          },
        };
      }

      const keys = extractFromCode(getCode('marker.js'), {
        marker: '__',
        babelOptions: { ast: true, plugins: [dynamicallyAddTranslation] },
      });

      assert.deepEqual(
        [
          {
            key: 'foo',
            loc: undefined,
          },
          {
            key: 'this_is_a_custom_marker',
            loc: {
              end: {
                column: 56,
                line: 5,
              },
              start: {
                column: 0,
                line: 5,
              },
            },
          },
        ],
        keys,
        'Should take into account the marker option.',
      );
    });
  });
});
