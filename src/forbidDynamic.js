const FORBID_DYNAMIC = 'FORBID_DYNAMIC';

export default function forbidDynamic(locale, keysUsed) {
  const reports = [];

  keysUsed.forEach(keyUsed => {
    // Dynamic key
    if (keyUsed.key.includes('*')) {
      reports.push({
        type: FORBID_DYNAMIC,
        ...keyUsed,
      });
    }
  });

  return reports;
}
