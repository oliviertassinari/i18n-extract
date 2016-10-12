import { parse } from 'babylon';
import traverse from 'babel-traverse';
import { uniq } from './utils';

const noInformationTypes = [
  'CallExpression',
  'Identifier',
  'MemberExpression',
];

function getKey(node) {
  if (node.type === 'StringLiteral') {
    return node.value;
  } else if (node.type === 'BinaryExpression' && node.operator === '+') {
    return getKey(node.left) + getKey(node.right);
  } else if (node.type === 'TemplateLiteral') {
    return node.quasis
      .map((quasi) => quasi.value.cooked)
      .join('*');
  } else if (noInformationTypes.includes(node.type)) {
    return '*'; // We can't extract anything.
  }

  console.warn(`Unsupported node: ${node.type}`);

  return null;
}

const commentRegExp = /i18n-extract (\S+)/;

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

  // Look for keys in the comments.
  ast.comments.forEach((comment) => {
    const match = commentRegExp.exec(comment.value);

    if (match) {
      keys.push(match[1]);
    }
  });

  // Look for keys in the source code.
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
