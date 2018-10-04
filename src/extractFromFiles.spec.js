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

  it('should work when scanning typescript', () => {
    const keys = extractFromFiles(
      ['src/extractFromFilesFixture/*.tsx', 'src/extractFromFilesFixture/*.ts'],
      { useTypescript: true },
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
          loc: { start: { line: 5, column: 0 }, end: { line: 5, column: 12 } },
          file: 'src/extractFromFilesFixture/LogoutView.ts',
        },
        {
          key: 'key1',
          loc: { start: { line: 6, column: 0 }, end: { line: 6, column: 12 } },
          file: 'src/extractFromFilesFixture/LogoutView.ts',
        },
      ],
      keys,
      'should work when scanning typescript',
    );
  });
});
