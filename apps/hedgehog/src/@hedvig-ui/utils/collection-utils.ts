export const stringSortByNumberOrText = (a: string, b: string) => {
  const _a = a.toLowerCase()
  const _b = b.toLowerCase()
  const regex = /\d+/g
  const numberA = _a.match(regex)?.[0]
  const numberB = _b.match(regex)?.[0]

  if (numberA && numberB) {
    const leadingA = _a.split(numberA)[0].trim()
    const leadingB = _b.split(numberB)[0].trim()
    const trailingA = _a.split(numberA)[1].trim()
    const trailingB = _b.split(numberB)[1].trim()

    if (leadingA === leadingB) {
      if (numberA === numberB) {
        return trailingB < trailingA ? 1 : -1
      }
      return parseInt(numberA) - parseInt(numberB)
    }
  }
  return _b < _a ? 1 : -1
}

declare global {
  interface Map<K, V> {
    /**
     * Remove the given key from the map, and return the value if it was present.
     * @param key
     */
    pluck(key: K): V | undefined
  }
}

Map.prototype.pluck = function <K, V>(this: Map<K, V>, key: K): V | undefined {
  const value = this.get(key)
  this.delete(key)
  return value
}

export const partitionBy = <T>(
  array: Iterable<T>,
  test: (val: T) => boolean,
): T[][] => {
  const left: T[] = []
  const right: T[] = []
  for (const val of array) {
    if (test(val)) {
      left.push(val)
    } else {
      right.push(val)
    }
  }
  return [left, right]
}

export const groupBy = <T>(
  array: T[],
  key: (val: T) => string,
): Record<string, T[]> => {
  const res: Record<string, T[]> = {}
  array.forEach((val) => {
    const k = key(val)
    if (!res[k]) {
      res[k] = []
    }
    res[k].push(val)
  })
  return res
}
