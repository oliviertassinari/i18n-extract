'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var gettextParser = require('gettext-parser');
var i18nExtract = require('../index.js');

describe('i18nExtract', function() {
  describe('#extractFromContent()', function() {
    it('should work when scanning jsx and es5 format', function() {
      var content = fs.readFileSync('jsx-es5.jsx', 'utf8');
      var messages = i18nExtract.extractFromContent(content);
      assert.deepEqual([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
      ], messages);
    });

    it('should work when scanning jsx and es6 format', function() {
      var content = fs.readFileSync('jsx-es6.jsx', 'utf8');
      var messages = i18nExtract.extractFromContent(content);
      assert.deepEqual([
        'Reset',
        'Revert',
        'Sweep',
        'Commit',
      ], messages);
    });

    it('should work when scanning with the marker option', function() {
      var content = fs.readFileSync('hello.js', 'utf8');
      var messages = i18nExtract.extractFromContent(content, {
        marker: '__',
      });
      assert.deepEqual([
        'this is a custom marker',
      ], messages);
    });
  });

  describe('#extractFromFiles()', function() {
    it('should work when scanning with a glob and a string parameter', function() {
      var messages = i18nExtract.extractFromFiles('*es5.jsx');
      assert.deepEqual([
        'Follow',
        'Followed!',
        'Unfollowed!',
        'Unfollow',
        'Following',
      ], messages);
    });

    it('should work when scanning with an array as parameter', function() {
      var messages = i18nExtract.extractFromFiles([
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

  describe('#mergeMessagesWithPO()', function() {
    it('should output a new po file with 5 merged messages when we give a po file with one outdate message', function() {
      var output = 'messages2.po';
      var messages = i18nExtract.extractFromFiles('*es5.jsx');

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
