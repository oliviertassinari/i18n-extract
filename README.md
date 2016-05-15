# i18n extract

> Manage localization with static analysis

[![npm version](https://img.shields.io/npm/v/i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/i18n-extract)
[![npm downloads](https://img.shields.io/npm/dm/i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/i18n-extract)
[![Build Status](https://travis-ci.org/oliviertassinari/i18n-extract.svg?branch=master)](https://travis-ci.org/oliviertassinari/i18n-extract)

[![Dependencies](https://img.shields.io/david/oliviertassinari/i18n-extract.svg?style=flat-square)](https://david-dm.org/oliviertassinari/i18n-extract)
[![DevDependencies](https://img.shields.io/david/dev/oliviertassinari/i18n-extract.svg?style=flat-square)](https://david-dm.org/oliviertassinari/i18n-extract#info=devDependencies&view=list)

## Installation

```sh
npm install i18n-extract
```

## Use case

This module analyses code statically for key usages, such as `i18n.t('some.key')`, in order to:

- Report keys that are missing
- Report keys that are unused.
- Report keys that are highly duplicated.

E.g. This module works well in conjunction with:
- [polyglot.js](https://github.com/airbnb/polyglot.js) (`marker: 'polyglot.t',`)
- webpack and his localisation plugin: [i18n-webpack-plugin](https://github.com/webpack/i18n-webpack-plugin) (`marker: 'i18n',`)


## Supported keys

- static:
```js
i18n('key.static')
```
- string concatenation:
```js
i18n('key.' + 'concat')
```
- template string:
```js
i18n(`key.template`)
```
- dynamic:
```js
i18n(`key.${dynamic}`)
```
- comment:
```js
/* i18n-extract key.comment */
```

## API

### extractFromCode(code, [options])

Parse the `code` to extract the argument of calls of i18n(`key`).

- `code` should be a string.
- Return an array containing keys used.

##### Example

```js
import {extractFromCode} from 'i18n-extract';
const keys = extractFromCode("const followMe = i18n('b2b.follow');", {
  marker: 'i18n',
});
// keys = ['b2b.follow']
```

### extractFromFiles(files, [options])

Parse the `files` to extract the argument of calls of i18n(`key`).

- `files` can be either an array of strings or a string. You can also use a glob.
- Return an array containing keys used in the source code.

##### Example

```js
import {extractFromFiles} from 'i18n-extract';
const keys = extractFromFiles([
  '*.jsx',
  '*.js',
], {
  marker: 'i18n',
});
```

### Options

- `marker`: The name of the internationalized string marker function. Defaults to `i18n`.

### findMissing(locale, keysUsed)

Report the missing keys. Those keys should probably be translated.

- `locale` should be a object containing the translations.
- `keysUsed` should be an array. Containes the keys used in the source code.
It can be retrieve with `extractFromFiles` our `extractFromCode`.
- Return a report.

##### Example

```js
import {findMissing} from 'i18n-extract';
const missing = findMissing({
  key1: 'key 1',
}, ['key1', 'key2']);

/**
 * missing = [{
 *   type: 'MISSING',
 *   key: 'key2',
 * }];
 */
```

### findUnused(locale, keysUsed)

Report the unused key. Those keys should probably be removed.

- `locale` should be a object containing the translations.
- `keysUsed` should be an array. Containes the keys used in the source code.
It can be retrieve with `extractFromFiles` our `extractFromCode`.
- Return a report.

##### Example

```js
import {findUnused} from 'i18n-extract';
const unused = findUnused({
  key1: 'key 1',
  key2: 'key 2',
}, ['key1']);

/**
 * unused = [{
 *   type: 'UNUSED',
 *   key: 'key2',
 * }];
 */
```

### findDuplicated(locale, keysUsed, options)

Report the duplicated key. Those keys should probably be mutualized.
The default `threshold` is 1, it will report any duplicated translations.

- `locale` should be a object containing the translations.
- `keysUsed` should be an array. Containes the keys used in the source code.
It can be retrieve with `extractFromFiles` our `extractFromCode`.
- `options` should be an object. You can provide a `threshold` property to change the number of duplicated value before it's added to the report.
- Return a report.

##### Example

```js
import {findDuplicated} from 'i18n-extract';
const duplicated = findDuplicated({
  key1: 'Key 1',
  key2: 'Key 2',
  key3: 'Key 2',
});

/**
 * unused = [{
 *   type: 'DUPLICATED',
 *   keys: [
 *     'key2',
 *     'key3',
 *   ],
 *   value: 'Key 2'
 * }]
 */
```

### flatten(object)

Flatten the object.

- `object` should be a object.

##### Example

```js
import {flatten} from 'i18n-extract';
const flattened = flatten({
  key2: 'Key 2',
  key4: {
    key41: 'Key 4.1',
    key42: {
      key421: 'Key 4.2.1',
    },
  },
});

/**
 * flattened = {
 *   key2: 'Key 2',
 *   'key4.key41': 'Key 4.1',
 *   'key4.key42.key421': 'Key 4.2.1',
 * };
 */
```

### mergeMessagesWithPO(messages, poInput, poOutput)

Output a new po file with only the messages present in `messages`.
If a message is already present in the `poInput`, we keep the translation.
If a message is not present, we add a new empty translation.

- `messages` should be an array.
- `poInput` should be a string.
- `poOutput` should be a string.

##### Example

```js
import {mergeMessagesWithPO} from 'i18n-extract';

const messages = ['Message 1', 'Message 2'];
mergeMessagesWithPO(messages, 'messages.po', 'messages.output.po');

/**
 * Will output :
 * > messages.output.po has 812 messages.
 * > We have added 7 messages.
 * > We have removed 3 messages.
 */
```

## License

MIT
