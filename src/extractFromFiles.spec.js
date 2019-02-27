/* eslint-env mocha */

import { assert } from 'chai';
import extractFromFiles from './extractFromFiles.js';

describe('#extractFromFiles()', () => {
  it('should work when scanning with a glob and a string parameter', () => {
    const keys = extractFromFiles('src/extractFromFilesFixture/*View.js');

    assert.deepEqual(
      [
        {
          key: 'key1',
          file: 'src/extractFromFilesFixture/AccoutView.js',
          loc: {
            end: {
              column: 12,
              line: 5,
            },
            start: {
              column: 0,
              line: 5,
            },
          },
        },
        {
          key: 'key2',
          file: 'src/extractFromFilesFixture/AccoutView.js',
          loc: {
            end: {
              column: 12,
              line: 6,
            },
            start: {
              column: 0,
              line: 6,
            },
          },
        },
        {
          key: 'key3',
          file: 'src/extractFromFilesFixture/ExpenseView.js',
          loc: {
            end: {
              column: 12,
              line: 5,
            },
            start: {
              column: 0,
              line: 5,
            },
          },
        },
        {
          key: 'key1',
          file: 'src/extractFromFilesFixture/ExpenseView.js',
          loc: {
            end: {
              column: 12,
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
      'Should find all the key without duplication',
    );
  });

  it('should work when scanning with an array as parameter', () => {
    const keys = extractFromFiles([
      'src/extractFromFilesFixture/*.jsx',
      'src/extractFromFilesFixture/*.js',
    ]);

    assert.deepEqual(
      [
        {
          key: 'key3',
          file: 'src/extractFromFilesFixture/MemberView.jsx',
          loc: {
            end: {
              column: 12,
              line: 5,
            },
            start: {
              column: 0,
              line: 5,
            },
          },
        },
        {
          key: 'key4',
          file: 'src/extractFromFilesFixture/MemberView.jsx',
          loc: {
            end: {
              column: 12,
              line: 6,
            },
            start: {
              column: 0,
              line: 6,
            },
          },
        },
        {
          key: 'key1',
          file: 'src/extractFromFilesFixture/AccoutView.js',
          loc: {
            end: {
              column: 12,
              line: 5,
            },
            start: {
              column: 0,
              line: 5,
            },
          },
        },
        {
          key: 'key2',
          file: 'src/extractFromFilesFixture/AccoutView.js',
          loc: {
            end: {
              column: 12,
              line: 6,
            },
            start: {
              column: 0,
              line: 6,
            },
          },
        },
        {
          key: 'key3',
          file: 'src/extractFromFilesFixture/ExpenseView.js',
          loc: {
            end: {
              column: 12,
              line: 5,
            },
            start: {
              column: 0,
              line: 5,
            },
          },
        },
        {
          key: 'key1',
          file: 'src/extractFromFilesFixture/ExpenseView.js',
          loc: {
            end: {
              column: 12,
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
      'Should work with an array as first parameter',
    );
  });

  it('should work when scanning typescript files', () => {
    const keys = extractFromFiles(
      ['src/extractFromFilesFixture/*.tsx', 'src/extractFromFilesFixture/*.ts'],
      { parser: 'typescript' },
    );

    assert.deepEqual(
      [
        {
          key: 'key3',
          loc: { start: { line: 5, column: 0 }, end: { line: 5, column: 12 } },
          file: 'src/extractFromFilesFixture/LoginView.tsx',
        },
        {
          key: 'key1',
          loc: { start: { line: 6, column: 0 }, end: { line: 6, column: 12 } },
          file: 'src/extractFromFilesFixture/LoginView.tsx',
        },
        {
          key: 'key3',
          loc: { start: { line: 7, column: 0 }, end: { line: 7, column: 12 } },
          file: 'src/extractFromFilesFixture/LogoutView.ts',
        },
        {
          key: 'key1',
          loc: { start: { line: 8, column: 0 }, end: { line: 8, column: 12 } },
          file: 'src/extractFromFilesFixture/LogoutView.ts',
        },
      ],
      keys,
      'should work when scanning typescript files',
    );
  });

  it('should throw a error when pass wrong value to parser params', () => {
    assert.throws(
      () =>
        extractFromFiles(
          ['src/extractFromFilesFixture/*.tsx', 'src/extractFromFilesFixture/*.ts'],
          {
            parser: 'babel',
          },
        ),
      'Parser must be either flow or typescript',
    );
  });

  it('should work when passing a custom Babel config', () => {
    const customBabelPlugin = babel => {
      const { types: t } = babel;
      return {
        visitor: {
          CallExpression(path) {
            const callee = path.node.callee;
            if (callee.name === 'someCrazyThingThatRequiresABabelTransform') {
              const properties = path.node.arguments[0].properties;
              const fooProperty = properties.find(node => node.key.name === 'foo');
              const i18nKey = fooProperty.value.value;
              path.node.callee.name = 'i18n';
              path.node.arguments = [t.StringLiteral(i18nKey)];
            }
          },
        },
      };
    };

    const keys = extractFromFiles(['src/extractFromFilesFixture/CustomTransform.js'], {
      babelOptions: {
        sourceType: 'module',
        ast: true,
        plugins: [customBabelPlugin],
      },
    });

    assert.deepEqual(
      [
        {
          file: 'src/extractFromFilesFixture/CustomTransform.js',
          key: 'key1',
          loc: {
            end: {
              column: 2,
              line: 9,
            },
            start: {
              column: 0,
              line: 7,
            },
          },
        },
      ],
      keys,
      'should work when scanning files with a custom Babel config',
    );
  });

  it('should throw an error when given both parser and babelOptions', () => {
    assert.throws(
      () =>
        extractFromFiles(['src/extractFromFilesFixture/*.js'], {
          parser: 'flow',
          babelOptions: {},
        }),
      "Can't specify both parser and Babel options!",
    );
  });
});
