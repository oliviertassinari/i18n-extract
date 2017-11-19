export function uniq(array) {
  const seen = {};
  return array.filter(item => {
    if (seen[item]) {
      return false;
    }

    seen[item] = true;
    return true;
  });
}

export default {};
