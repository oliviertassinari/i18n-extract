/* eslint-disable quotes */
/* eslint-disable prefer-template */
import i18n from 'i18n';

const foo = 'bar';

i18n(`key${foo}`);
i18n(`key.${foo}`);
i18n(`key.${foo}.bar`);
i18n(`key.${foo}bar`);

i18n('key' + foo);
i18n('key.' + foo);
i18n('key' + foo + '.bar');
i18n('key' + foo + 'bar');
