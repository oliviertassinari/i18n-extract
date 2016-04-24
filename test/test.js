import {assert} from 'chai';
import fs from 'fs';
import gettextParser from 'gettext-parser';
import i18nExtract from '../src/index.js';

describe('i18nExtract', () => {
  describe('#extractFromCode()', () => {
    it('should work when scanning jsx and es5 format', () => {
      const code = fs.readFileSync('jsx-es5.jsx', 'utf8');
      const messages = i18nExtract.extractFromCode(code);
      assert.deepEqual([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
      ], messages);
    });

    it('should work when scanning jsx and es6 format', () => {
      const code = fs.readFileSync('jsx-es6.jsx', 'utf8');
      const messages = i18nExtract.extractFromCode(code);
      assert.deepEqual([
        'Reset',
        'Revert',
        'Sweep',
        'Commit',
      ], messages);
    });

    it('should work when scanning with the marker option', () => {
      const code = fs.readFileSync('hello.js', 'utf8');
      const messages = i18nExtract.extractFromCode(code, {
        marker: '__',
      });
      assert.deepEqual([
        'this is a custom marker',
      ], messages);
    });

    it('should work with multiple arguments in the i18n function', () => {
      const code = fs.readFileSync('many-args.js', 'utf8');
      const messages = i18nExtract.extractFromCode(code);
      assert.deepEqual([
        'Hello, {{username}}!',
      ], messages);
    });
  });

  describe('#extractFromFiles()', () => {
    it('should work when scanning with a glob and a string parameter', () => {
      const messages = i18nExtract.extractFromFiles('*es5.jsx');
      assert.deepEqual([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
      ], messages);
    });

    it('should work when scanning with an array as parameter', () => {
      const messages = i18nExtract.extractFromFiles([
        '*es5.jsx',
        'hello.js',
      ]);
      assert.deepEqual([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
        'hello',
      ], messages);
    });
  });

  describe('#mergeMessagesWithPO()', () => {
    it('should output a new po file with 5 merged messages when we give a po file with one outdate message', () => {
      const output = 'messages2.po';
      const messages = i18nExtract.extractFromFiles('*es5.jsx');

      i18nExtract.mergeMessagesWithPO(messages, 'messages.po', output);

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
            'Follow': {
              msgid: 'Follow',
              msgstr: [
                'Suivre',
              ],
            },
            'Followed!': {
              msgid: 'Followed!',
              msgstr: [
                'Suivi !',
              ],
            },
            'Following': {
              msgid: 'Following',
              msgstr: [
                '',
              ],
            },
            'Unfollow': {
              msgid: 'Unfollow',
              msgstr: [
                '',
              ],
            },
            'Unfollowed!': {
              msgid: 'Unfollowed!',
              msgstr: [
                '',
              ],
            },
          },
        },
      });
    });
  });
});
