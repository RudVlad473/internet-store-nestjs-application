export function getFirstTruthyValue<K>(obj: {
  [key: string]: K;
}): K | undefined {
  for (const key in obj) {
    if (obj[key]) {
      return obj[key];
    }
  }
  return undefined;
}
