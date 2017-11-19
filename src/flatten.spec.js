/* eslint-env mocha */

import { assert } from 'chai';
import flatten from './flatten.js';

describe('#flatten()', () => {
  it('should work with flat object', () => {
    const flattened = flatten({
      key1: 'Key 1',
      key2: 'Key 2',
      key4: 'Key 4',
    });

    assert.deepEqual(
      {
        key1: 'Key 1',
        key2: 'Key 2',
        key4: 'Key 4',
      },
      flattened,
      'Should work with a flat object.',
    );
  });

  it('should work with a nested object', () => {
    const flattened = flatten({
      key1: 'Key 1',
      key2: 'Key 2',
      key4: {
        key41: 'Key 4.1',
        key42: {
          key421: 'Key 4.2.1',
        },
      },
    });

    assert.deepEqual(
      {
        key1: 'Key 1',
        key2: 'Key 2',
        'key4.key41': 'Key 4.1',
        'key4.key42.key421': 'Key 4.2.1',
      },
      flattened,
      'Should work with a flat object.',
    );
  });
});
