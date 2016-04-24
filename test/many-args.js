import i18n from 'i18n';

const user = {
  username: 'world',
};

i18n('Hello, {{username}}!', {
  username: user.username,
});
