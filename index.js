'use strict';

var esprima = require('esprima-fb');
var traverse = require('traverse');
var glob = require('glob');
var fs = require('fs');
var gettextParser = require('gettext-parser');

function match(actual, expected) {
  if (actual !== null && typeof actual === 'object') {
    var isMatching = true;

    Object.keys(expected).forEach(function(key) {
      if (expected.hasOwnProperty(key)) {
        isMatching = isMatching && match(actual[key], expected[key]);
      }
    });

    return isMatching;
  } else {
    return actual === expected;
  }
}

function extractFromContent(content) {
  var messages = [];

  function getMessage(node) {
    if (node.type === 'Literal') {
      return node.value;
    } else if (node.type === 'BinaryExpression' && node.operator === '+') {
      return getMessage(node.left) + getMessage(node.right);
    } else {
      console.warn('Unsupported ' + node.type);
      return '';
    }
  }
  var stringMarker = {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'i18n',
    },
  };

  // See the specs of the ast https://github.com/estree/estree/blob/master/spec.md
  var contentAst = esprima.parse(content);

  traverse(contentAst).forEach(function(node) {
    if (match(node, stringMarker)) {
      var message = getMessage(node.arguments[0]);
      messages.push(message);
    }
  });

  return messages;
}

function extractFromFiles(filenames) {
  var messages = [];

  // filenames should be an array
  if (typeof filenames === 'string') {
    filenames = [
      filenames,
    ];
  }

  var filenamesToScan = [];

  filenames.forEach(function(filename) {
    filenamesToScan = filenamesToScan.concat(glob.sync(filename, {}));
  });

  filenamesToScan.forEach(function(filename) {
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
  var messagesNew = 0;
  var messagesReused = 0;

  messages.forEach(function(message) {
    // The translation already exist
    if(poTransalations[message]) {
      messagesReused++;
      translations[message] = poTransalations[message];
      delete translations[message].comments;
    } else {
      messagesNew++;
      translations[message] = {
        msgid: message,
        msgstr: [
          '',
        ],
      };
    }
  });

  po.translations[''] = translations;

  fs.writeFileSync(outputFileName, gettextParser.po.compile(po));

  var messagesLengthBefore = Object.keys(poTransalations).length - 1;
  var messagesLengthAfter = Object.keys(translations).length;

  console.log(outputFileName + ' has ' + messagesLengthAfter + ' messages.');
  console.log('We have added ' + messagesNew + ' messages.');
  console.log('We have removed ' + (messagesLengthBefore - messagesReused) + ' messages.');
};
