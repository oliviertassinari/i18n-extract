import {parse} from 'babylon';
import traverse from 'babel-traverse';

import {uniq} from './utils';

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

export default function extractFromCode(code, options) {
  const messages = [];
  options = options || {};

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
