export const getOrThrowFormValue = (formData: FormData, field: string) => {
  const value = formData.get(field)
  if (typeof value !== 'string') {
    throw new Error(`Missing form value for ${field}`)
  }

  return value
}
