/* eslint-disable */

import i18n from 'i18n';

const foo = true;

// &&
i18n(foo && 'bar');

// ||
i18n(foo || 'baz');

// mixed
i18n('bar' || (foo && 'baz'));
