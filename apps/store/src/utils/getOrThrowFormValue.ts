import type { Fields } from 'formidable'

export const getOrThrowFormValue = (formData: Fields, field: string) => {
  const value = formData[field]
  if (typeof value !== 'string') {
    throw new Error(`Missing form value for ${field}`)
  }

  return value
}
