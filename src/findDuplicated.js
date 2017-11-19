const DUPLICATED = 'DUPLICATED';

export default function findDuplicated(locale, keysUsed, options = {}) {
  const reports = [];

  const { threshold = 1 } = options;

  const valuesUsedHash = {};

  // Used for the second stage report
  const valuesAboveThreshold = [];

  Object.keys(locale).forEach(key => {
    const value = locale[key];

    if (valuesUsedHash[value]) {
      valuesUsedHash[value].push(key);
    } else {
      valuesUsedHash[value] = [key];
    }

    if (valuesUsedHash[value].length === threshold + 1) {
      valuesAboveThreshold.push(value);
    }
  });

  valuesAboveThreshold.forEach(value => {
    reports.push({
      type: DUPLICATED,
      keys: valuesUsedHash[value],
      value,
    });
  });

  return reports;
}
