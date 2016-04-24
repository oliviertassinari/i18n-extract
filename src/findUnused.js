const UNUSED = 'UNUSED';

export default function findUnused(locale, keysUsed) {
  const reports = [];

  const keysUsedHash = {};

  keysUsed.forEach((key) => {
    keysUsedHash[key] = true;
  });

  Object.keys(locale).forEach((key) => {
    if (!keysUsedHash[key]) {
      reports.push({
        type: UNUSED,
        key: key,
      });
    }
  });

  return reports;
}
