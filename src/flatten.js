export default function flatten(locale, prefix = '', flattened = {}) {
  Object.keys(locale).forEach(key => {
    const value = locale[key];

    let fullKey;

    if (prefix !== '') {
      fullKey = `${prefix}.${key}`;
    } else {
      fullKey = key;
    }

    if (typeof value === 'string') {
      flattened[fullKey] = value;
    } else {
      flatten(value, fullKey, flattened);
    }
  });

  return flattened;
}
