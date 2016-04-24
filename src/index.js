import {parse} from 'babylon';
import traverse from 'babel-traverse';
import glob from 'glob';
import fs from 'fs';
import gettextParser from 'gettext-parser';

function uniq(array) {
  const seen = {};
  return array.filter((item) => {
    return seen[item] ? false : (seen[item] = true);
  });
}

function extractFromContent(code, options) {
  const messages = [];
  options = options || {};

  function getMessage(node) {
    if (node.type === 'StringLiteral') {
      return node.value;
    } else if (node.type === 'BinaryExpression' && node.operator === '+') {
      return getMessage(node.left) + getMessage(node.right);
    } else {
      console.warn(`Unsupported node : ${node}`);
      return null;
    }
  }

  const ast = parse(code, {
    sourceType: 'module',

    // Enable all the plugins
    plugins: [
      'jsx',
      'flow',
      'asyncFunctions',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent',
    ],
  });

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      if (callee.type === 'Identifier' && callee.name === (options.marker || 'i18n')) {
        const message = getMessage(path.node.arguments[0]);

        if (message) {
          messages.push(message);
        }
      }
    },
  });

  return uniq(messages);
}

function extractFromFiles(filenames, options) {
  let messages = [];

  // filenames should be an array
  if (typeof filenames === 'string') {
    filenames = [
      filenames,
    ];
  }

  let filenamesToScan = [];

  filenames.forEach((filename) => {
    filenamesToScan = filenamesToScan.concat(glob.sync(filename, {}));
  });

  filenamesToScan.forEach((filename) => {
    const content = fs.readFileSync(filename, 'utf8');
    messages = messages.concat(extractFromContent(content, options));
  });

  return uniq(messages);
}

function mergeMessagesWithPO(messages, poFileName, outputFileName) {
  const poContent = fs.readFileSync(poFileName, 'utf8');
  const po = gettextParser.po.parse(poContent);

  const poTransalations = po.translations[''];
  const translations = {};
  let messagesNew = 0;
  let messagesReused = 0;

  messages.forEach((message) => {
    // The translation already exist
    if (poTransalations[message]) {
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

  const messagesLengthBefore = Object.keys(poTransalations).length - 1; // Not sure why the -1 is for
  const messagesLengthAfter = Object.keys(translations).length;

  console.log(`${outputFileName} has ${messagesLengthAfter} messages.`);
  console.log(`We have added ${messagesNew} messages.`);
  console.log(`We have removed ${messagesLengthBefore - messagesReused} messages.`);
}

module.exports.extractFromContent = extractFromContent;
module.exports.extractFromFiles = extractFromFiles;
module.exports.mergeMessagesWithPO = mergeMessagesWithPO;
