/* eslint-env mocha */

import { assert } from 'chai';
import fs from 'fs';
import path from 'path';
import gettextParser from 'gettext-parser';
import extractFromFiles from './extractFromFiles.js';
import mergeMessagesWithPO from './mergeMessagesWithPO.js';

describe('#mergeMessagesWithPO()', () => {
  const output = 'messages2.po';
  let messages;

  beforeEach(() => {
    messages = extractFromFiles('src/mergeMessagesWithPOFixtures/input.js');
  });

  afterEach(() => {
    fs.unlinkSync(output);
  });

  it('should not crash when the path is absolute', () => {
    mergeMessagesWithPO(messages, path.join(__dirname, 'mergeMessagesWithPOFixtures/messages.po'), output);
  });

  it('should output a new po file with merged messages when we give a po file outdated message', () => {
    mergeMessagesWithPO(messages, 'mergeMessagesWithPOFixtures/messages.po', output);

    const poContent = fs.readFileSync(output);
    const po = gettextParser.po.parse(poContent);

    assert.deepEqual(po, {
      charset: 'utf-8',
      headers: {
        'content-transfer-encoding': '8bit',
        'content-type': 'text/plain; charset=utf-8',
        language: 'fr',
      },
      translations: {
        '': {
          '': {
            msgid: '',
            msgstr: [
              'Language: fr\nContent-Type: text/plain; charset=utf-8\nContent-Transfer-Encoding: 8bit\n',
            ],
          },
          follow: {
            msgid: 'follow',
            msgstr: [
              'Suivre',
            ],
          },
          followed: {
            msgid: 'followed',
            msgstr: [
              'Suivi !',
            ],
          },
          following: {
            msgid: 'following',
            msgstr: [
              '',
            ],
          },
          unfollow: {
            msgid: 'unfollow',
            msgstr: [
              '',
            ],
          },
          unfollowed: {
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
