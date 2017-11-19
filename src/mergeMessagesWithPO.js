import fs from 'fs';
import path from 'path';
import gettextParser from 'gettext-parser';

export default function mergeMessagesWithPO(messages, poFileName, outputFileName) {
  const poContent = fs.readFileSync(path.resolve(__dirname, poFileName), 'utf8');
  const po = gettextParser.po.parse(poContent);

  const poTransalations = po.translations[''];
  const translations = {};
  let messagesNew = 0;
  let messagesReused = 0;

  messages.forEach(message => {
    message = message.key;

    // The translation already exist
    if (poTransalations[message]) {
      messagesReused += 1;
      translations[message] = poTransalations[message];
      delete translations[message].comments;
    } else {
      messagesNew += 1;
      translations[message] = {
        msgid: message,
        msgstr: [''],
      };
    }
  });

  po.translations[''] = translations;

  fs.writeFileSync(outputFileName, gettextParser.po.compile(po));

  // Not sure why the -1 is for
  const messagesLengthBefore = Object.keys(poTransalations).length - 1;
  const messagesLengthAfter = Object.keys(translations).length;

  console.log(`${outputFileName} has ${messagesLengthAfter} messages.`);
  console.log(`We have added ${messagesNew} messages.`);
  console.log(`We have removed ${messagesLengthBefore - messagesReused} messages.`);
}
