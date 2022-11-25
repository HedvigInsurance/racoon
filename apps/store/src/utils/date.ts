export const convertToDate = (value: unknown) => {
  if (typeof value === 'string') {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date
  }

  return null
}

export const formatAPIDate = (date: Date) => {
  return date.toISOString().substring(0, 10)
}
