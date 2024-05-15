type RecursiveNullify<T> = {
  [P in keyof T]: T[P] extends object ? RecursiveNullify<T[P]> : null
}

export function nullifyObject<T extends Record<string, any>>(obj: T): RecursiveNullify<T> {
  const result: Record<string, unknown> = {}

  Object.keys(obj).forEach((key) => {
    const value: unknown = obj[key]
    const isNestedObject = typeof value === 'object' && value !== null
    result[key] = isNestedObject ? nullifyObject(value) : null
  })

  return result as RecursiveNullify<T>
}
