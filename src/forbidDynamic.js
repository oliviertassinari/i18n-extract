const FORBID_DYNAMIC = 'FORBID_DYNAMIC';

export default function forbidDynamic(locale, keysUsed) {
  const reports = [];

  keysUsed.forEach((keyUsed) => {
    // Dynamic key
    if (keyUsed.includes('*')) {
      reports.push({
        type: FORBID_DYNAMIC,
        key: keyUsed,
      });
    }
  });

  return reports;
}
