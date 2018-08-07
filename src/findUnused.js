const UNUSED = 'UNUSED';

export default function findUnused(locale, keysUsed) {
  const reports = [];

  const keysUsedHash = {};

  keysUsed.forEach(keyUsed => {
    keyUsed = keyUsed.key;

    // Ignore '*' keys
    if (keyUsed === '*') return;

    // Dynamic key
    if (keyUsed.includes('*')) {
      const regExp = new RegExp(`^${keyUsed.replace('*', '(.+)')}$`);

      Object.keys(locale).forEach(localeKey => {
        if (regExp.exec(localeKey) !== null) {
          keysUsedHash[localeKey] = true;
        }
      });
    } else {
      keysUsedHash[keyUsed] = true;
    }
  });

  Object.keys(locale).forEach(key => {
    if (!keysUsedHash[key]) {
      reports.push({
        type: UNUSED,
        key,
      });
    }
  });

  return reports;
}
