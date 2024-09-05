export const getFormValueOrThrow = (formData: FormData, field: string): string => {
  const value = formData.get(field)
  if (typeof value !== 'string') throw new Error(`Missing field ${field}`)
  return value
}
