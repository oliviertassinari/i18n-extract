# i18n Extract [![Build Status](https://travis-ci.org/oliviertassinari/i18n-extract.svg)](https://travis-ci.org/oliviertassinari/i18n-extract) [![npm version](https://badge.fury.io/js/i18n-extract.svg)](http://badge.fury.io/js/i18n-extract)

> Extract messages from js and jsx to po

## Installation

```sh
npm install i18n-extract
```

## Usage

### extractFromContent(content)

Parse the `content` to extract the argument of calls of i18n(`message`). 

- `content` should be a string.
- Return an array containing messages used.

```js
var i18nExtract = require('i18n-extract');
var messages = i18nExtract.extractFromContent("
  var follow = i18n('Follow');
  var followMe = i18n('Follow ' + 'me');
");

// messages contains ['Follow', 'Follow me']
```

### extractFromFiles(files)

Parse the `files` to extract the argument of calls of i18n(`message`).

- `files` can be either an array of strings or a string. You can also use a glob.
- Return an array containing messages used in the source code.

```js
var i18nExtract = require('i18n-extract');
var messages = i18nExtract.extractFromFiles(['*.jsx', '*.js']);
```

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
```

## License

MIT
