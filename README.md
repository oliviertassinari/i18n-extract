# i18n Extract

> Extract messages from js and jsx to po.

[![npm version](https://img.shields.io/npm/v/i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/i18n-extract)
[![npm downloads](https://img.shields.io/npm/dm/i18n-extract.svg?style=flat-square)](https://www.npmjs.com/package/i18n-extract)
[![Build Status](https://travis-ci.org/oliviertassinari/i18n-extract.svg?branch=master)](https://travis-ci.org/oliviertassinari/i18n-extract)

[![Dependencies](https://img.shields.io/david/oliviertassinari/i18n-extract.svg?style=flat-square)](https://david-dm.org/oliviertassinari/i18n-extract)
[![DevDependencies](https://img.shields.io/david/dev/oliviertassinari/i18n-extract.svg?style=flat-square)](https://david-dm.org/oliviertassinari/i18n-extract#info=devDependencies&view=list)

## Installation

```sh
npm install i18n-extract
```

## Usage

### extractFromContent(content, [options])

Parse the `content` to extract the argument of calls of i18n(`message`).

- `content` should be a string.
- Return an array containing messages used.

```js
var i18nExtract = require('i18n-extract');
var messages = i18nExtract.extractFromContent("
  var follow = i18n('Follow');
  var followMe = i18n('Follow ' + 'me');
", {
  marker: 'i18n',
});

// messages contains ['Follow', 'Follow me']
```

### extractFromFiles(files, [options])

Parse the `files` to extract the argument of calls of i18n(`message`).

- `files` can be either an array of strings or a string. You can also use a glob.
- Return an array containing messages used in the source code.

```js
var i18nExtract = require('i18n-extract');
var messages = i18nExtract.extractFromFiles([
  '*.jsx',
  '*.js',
], {
  marker: 'i18n',
});
```

### Options

- `marker`: The name of the internationalized string marker function. Defaults to `i18n`.

### mergeMessagesWithPO(messages, poInput, poOutput)

Output a new po file with only the messages present in `messages`.
If a message is already present in the `poInput`, we keep the translation.
If a message is not present, we add a new empty translation.

- `messages` should be an array.
- `poInput` should be a string.
- `poOutput` should be a string.

```js
var i18nExtract = require('i18n-extract');
var messages = ['Message 1', 'Message 2'];
i18nExtract.mergeMessagesWithPO(messages, 'messages.po', 'messages.output.po');

/**
 Will output :
 > messages.output.po has 812 messages.
 > We have added 7 messages.
 > We have removed 3 messages.
*/
```

## Use case

This module works well in conjunction with webpack and his localisation plugin : [i18n-webpack-plugin](https://github.com/webpack/i18n-webpack-plugin).

## License

MIT

## Changelog

See [CHANGELOG.md](https://github.com/oliviertassinari/i18n-extract/tree/master/CHANGELOG.md)
