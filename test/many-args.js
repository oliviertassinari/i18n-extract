'use strict';

var user = {
  username: 'world',
};
var greeting = i18n('Hello, {{username}}!', {
  username: user.username,
});
