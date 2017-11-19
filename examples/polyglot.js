import { extractFromFiles, findMissing, findUnused, findDuplicated, flatten } from 'i18n-extract';
import frLocale from './src/locale/frLocale';

const frLocaleFlattened = flatten(frLocale);

const keys = extractFromFiles(['src/**/*.js'], {
  marker: 'polyglot.t',
});

let reports = [];
reports = reports.concat(findMissing(frLocaleFlattened, keys));
reports = reports.concat(findUnused(frLocaleFlattened, keys));
reports = reports.concat(findDuplicated(frLocaleFlattened, keys));

if (reports.length > 0) {
  console.log(reports); // eslint-disable-line no-console
  /**
   * Could output something like:
   * [
   *   {type: 'MISSING', key: 'paid_by_name'},
   *   {type: 'UNUSED', key: 'description_short'},
   *   {
   *     type: 'DUPLICATED',
   *     keys: ['description', 'description_short'],
   *     value: 'Description'
   *   }
   * ]
   */
  throw new Error('There is some issues with the i18n keys');
}
