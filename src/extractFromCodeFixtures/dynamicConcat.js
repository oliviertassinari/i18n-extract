/* eslint-disable */

import i18n from 'i18n';

const foo = 'bar';

// Tail position
i18n('key.' + foo);

// Middle position
i18n('key.' + foo + '.bar');

// Start position
i18n(foo + '.bar');

// All
i18n(foo);
