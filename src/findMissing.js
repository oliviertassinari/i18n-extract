const MISSING = 'MISSING';

function isMissing(key, locale) {
  // Dynamic key
  if (key.includes('*')) {
    const regExp = new RegExp(key.replace('*', '(.+)'));

    return Object.keys(locale)
      .sort() // Not stable sort
      .every((localeKey) => {
        return regExp.exec(localeKey) === null;
      });
  } else {
    return !locale[key];
  }
}

export default function findMissing(locale, keysUsed) {
  const reports = [];

  keysUsed.forEach((key) => {
    if (isMissing(key, locale)) {
      reports.push({
        type: MISSING,
        key: key,
      });
    }
  });

  return reports;
}
