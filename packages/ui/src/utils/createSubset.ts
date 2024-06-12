export function createSubset<T extends object, K extends keyof T>(
  original: T,
  keysToInclude: Array<K>,
): Pick<T, K> {
  return Object.fromEntries(
    Object.entries(original).filter(([key]) => keysToInclude.includes(key as K)),
  ) as Pick<T, K>
}
