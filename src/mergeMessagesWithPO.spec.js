import {assert} from 'chai';
import fs from 'fs';
import gettextParser from 'gettext-parser';

import extractFromFiles from './extractFromFiles.js';
import mergeMessagesWithPO from './mergeMessagesWithPO.js';

describe('#mergeMessagesWithPO()', () => {
  it('should output a new po file with 5 merged messages when we give a po file with one outdate message', () => {
    const output = 'messages2.po';
    const messages = extractFromFiles('src/mergeMessagesWithPOFixtures/input.js');

    mergeMessagesWithPO(messages, 'mergeMessagesWithPOFixtures/messages.po', output);

    const poContent = fs.readFileSync(output);
    const po = gettextParser.po.parse(poContent);

    fs.unlinkSync(output);

    assert.deepEqual(po, {
      charset: 'utf-8',
      headers: {
        'content-transfer-encoding': '8bit',
        'content-type': 'text/plain; charset=utf-8',
        language: 'fr',
      },
      'translations': {
        '': {
          '': {
            msgid: '',
            msgstr: [
              'Language: fr\nContent-Type: text/plain; charset=utf-8\nContent-Transfer-Encoding: 8bit\n',
            ],
          },
          'follow': {
            msgid: 'follow',
            msgstr: [
              'Suivre',
            ],
          },
          'followed': {
            msgid: 'followed',
            msgstr: [
              'Suivi !',
            ],
          },
          'following': {
            msgid: 'following',
            msgstr: [
              '',
            ],
          },
          'unfollow': {
            msgid: 'unfollow',
            msgstr: [
              '',
            ],
          },
          'unfollowed': {
            msgid: 'unfollowed',
            msgstr: [
              '',
            ],
          },
        },
      },
    });
  });
});
