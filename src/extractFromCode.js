import {parse} from 'babylon';
import traverse from 'babel-traverse';

import {uniq} from './utils';

function getKey(node) {
  if (node.type === 'StringLiteral') {
    return node.value;
  } else if (node.type === 'BinaryExpression' && node.operator === '+') {
    return getKey(node.left) + getKey(node.right);
  } else if (node.type === 'TemplateLiteral') {
    return node.quasis.reduce((key, quasi) => {
      const cooked = quasi.value.cooked;

      if (key !== '' && cooked !== '') {
        return `${key}*${cooked}`;
      }

      return key + cooked;
    }, '');
  } else if (node.type === 'CallExpression' || node.type === 'Identifier') {
    return '*'; // We can't extract anything.
  } else {
    console.warn(`Unsupported node: ${node.type}`);
    return null;
  }
}

export default function extractFromCode(code, options = {}) {
  const {
    marker = 'i18n',
  } = options;

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

  const keys = [];

  traverse(ast, {
    CallExpression(path) {
      const {
        node,
      } = path;

      const {
        callee: {
          name,
          type,
        },
      } = node;

      if ((type === 'Identifier' && name === marker) ||
        path.get('callee').matchesPattern(marker)) {
        const key = getKey(node.arguments[0]);

        if (key) {
          keys.push(key);
        }
      }
    },
  });

  return uniq(keys);
}
