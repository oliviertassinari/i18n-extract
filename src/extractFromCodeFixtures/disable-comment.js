/* eslint-disable */
import i18n from 'i18n';

i18n('foo.bar1');
i18n('foo.bar2'); /* i18n-extract-disable-line */
i18n('foo.bar4'); /*
                    * i18n-extract-disable-line
                    */
i18n('foo.bar5'); // i18n-extract-disable-line
/* i18n-extract-disable-line */ i18n('foo.bar6');
i18n('foo.bar3');
