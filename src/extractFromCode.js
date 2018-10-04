import { parse } from 'babylon';
import traverse from '@babel/traverse';

const noInformationTypes = ['CallExpression', 'Identifier', 'MemberExpression'];

function getKeys(node) {
  if (node.type === 'StringLiteral') {
    return [node.value];
  } else if (node.type === 'BinaryExpression' && node.operator === '+') {
    const left = getKeys(node.left);
    const right = getKeys(node.right);
    if (left.length > 1 || right.length > 1) {
      console.warn('Unsupported multiple keys for binary expression, keys skipped.'); // TODO
    }
    return [left[0] + right[0]];
  } else if (node.type === 'TemplateLiteral') {
    return [node.quasis.map(quasi => quasi.value.cooked).join('*')];
  } else if (node.type === 'ConditionalExpression') {
    return [...getKeys(node.consequent), ...getKeys(node.alternate)];
  } else if (node.type === 'LogicalExpression') {
    switch (node.operator) {
      case '&&':
        return [...getKeys(node.right)];
      case '||':
        return [...getKeys(node.left), ...getKeys(node.right)];
      default:
        console.warn(`unsupported logicalExpression's operator: ${node.operator}`);
        return [null];
    }
  } else if (noInformationTypes.includes(node.type)) {
    return ['*']; // We can't extract anything.
  }

  console.warn(`Unsupported node: ${node.type}`);

  return [null];
}

const commentRegExp = /i18n-extract (.+)/;
const commentIgnoreRegExp = /i18n-extract-disable-line/;

export default function extractFromCode(code, options = {}) {
  const { marker = 'i18n', keyLoc = 0, useTypeScript = false } = options;

  const ast = parse(code, {
    sourceType: 'module',

    // Enable all the plugins
    plugins: [
      'jsx',
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
      'dynamicImport',
    ].concat([useTypeScript ? 'typescript' : 'flow']),
  });

  const keys = [];
  const ignoredLines = [];

  // Look for keys in the comments.
  ast.comments.forEach(comment => {
    let match = commentRegExp.exec(comment.value);
    if (match) {
      keys.push({
        key: match[1].trim(),
        loc: comment.loc,
      });
    }

    // Check for ignored lines
    match = commentIgnoreRegExp.exec(comment.value);
    if (match) {
      ignoredLines.push(comment.loc.start.line);
    }
  });

  // Look for keys in the source code.
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;

      if (ignoredLines.includes(node.loc.end.line)) {
        // Skip ignored lines
        return;
      }

      const {
        callee: { name, type },
      } = node;

      if ((type === 'Identifier' && name === marker) || path.get('callee').matchesPattern(marker)) {
        const foundKeys = getKeys(
          keyLoc < 0 ? node.arguments[node.arguments.length + keyLoc] : node.arguments[keyLoc],
        );

        foundKeys.forEach(key => {
          if (key) {
            keys.push({
              key,
              loc: node.loc,
            });
          }
        });
      }
    },
  });

  return keys;
}
