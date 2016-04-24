const MISSING = 'MISSING';

export default function findMissing(locale, keysUsed) {
  const reports = [];

  keysUsed.forEach((key) => {
    if (!locale[key]) {
      reports.push({
        type: MISSING,
        key: key,
      });
    }
  });

  return reports;
}
