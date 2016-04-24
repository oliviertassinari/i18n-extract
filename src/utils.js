export function uniq(array) {
  const seen = {};
  return array.filter((item) => {
    return seen[item] ? false : (seen[item] = true);
  });
}
