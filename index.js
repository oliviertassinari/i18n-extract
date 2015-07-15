'use strict';

var esprima = require('esprima-fb');
var traverse = require('traverse');
var glob = require('glob');
var fs = require('fs');
var gettextParser = require('gettext-parser');

function match(actual, expected) {
  if (actual !== null && typeof actual === 'object') {
    var isMatching = true;

    for(var name in expected) {
      if (expected.hasOwnProperty(name)) {
        isMatching = isMatching && match(actual[name], expected[name]);
      }
    }

    return isMatching;
  } else {
    return actual === expected;
  }
}

var stringMarker = {
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'i18n',
  },
};

function extractFromContent(content) {
  var messages = [];

  // See the specs of the ast https://github.com/estree/estree/blob/master/spec.md
  var contentAst = esprima.parse(content);

  traverse(contentAst).forEach(function(node) {
    if (match(node, stringMarker)) {
      var message = node.arguments[0].value;
      messages.push(message);
    }
  });

  return messages;
}

function extractFromFiles(files) {
  var messages = [];

  files = glob.sync(files, {});
  files.forEach(function(filename) {
    var content = fs.readFileSync(filename);
    messages = messages.concat(extractFromContent(content));
  });

  return messages;
}

module.exports.extractFromContent = extractFromContent;
module.exports.extractFromFiles = extractFromFiles;

module.exports.mergeMessagesWithPO = function(messages, poFileName, outputFileName) {
  var poContent = fs.readFileSync(poFileName);
  var po = gettextParser.po.parse(poContent);

  var poTransalations = po.translations[''];
  var translations = {};

  messages.forEach(function(message) {
    translations[message] = poTransalations[message];

    if(!translations[message]) {
      translations[message] = {
        msgid: message,
        msgstr: [
          '',
        ],
      };
    }
  });


  po.translations[''] = translations;

  return fs.writeFileSync(outputFileName, gettextParser.po.compile(po));
};
