'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var gettextParser = require('gettext-parser');
var i18nExtract = require('../index.js');

describe('i18nExtract', function() {
  describe('#extractFromContent()', function() {
    it('should return 5 messages when scanning fixture.jsx', function() {
      var content = fs.readFileSync('fixture.jsx');
      var messages = i18nExtract.extractFromContent(content);
      assert.sameMembers([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
      ], messages);
    });
  });

  describe('#extractFromFiles()', function() {
    it('should return 5 messages when scanning *.jsx', function() {
      var messages = i18nExtract.extractFromFiles('*.jsx');
      assert.sameMembers([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
      ], messages);
    });
  });

  describe('#mergeMessagesWithPO()', function() {
    it('should output a new po file with 5 merged messages when we give a po file with one outdate message', function() {
      var output = 'messages2.po';
      var messages = i18nExtract.extractFromFiles('*.jsx');

      i18nExtract.mergeMessagesWithPO(messages, 'messages.po', output);

      var poContent = fs.readFileSync(output);
      var po = gettextParser.po.parse(poContent);

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
