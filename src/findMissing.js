const MISSING = 'MISSING';

function isMissing(locale, keyUsed) {
  // Dynamic key
  if (keyUsed.includes('*')) {
    const regExp = new RegExp(`^${keyUsed.replace('*', '(.+)')}$`);

    return Object.keys(locale).every(localeKey => {
      return regExp.exec(localeKey) === null;
    });
  }

  return !locale[keyUsed];
}

export default function findMissing(locale, keysUsed) {
  const reports = [];

  keysUsed.forEach(keyUsed => {
    if (isMissing(locale, keyUsed.key)) {
      reports.push({
        type: MISSING,
        ...keyUsed,
      });
    }
  });

  return reports;
}
