/* eslint-disable */

import i18n from 'i18n';

const foo = 'bar';

// simple
i18n(foo ? foo : 'bar');

// nested
i18n(foo ? (foo.length > 1 ? foo : 'baz') : 'bar');
