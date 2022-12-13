export const convertToDate = (value: unknown) => {
  if (typeof value === 'string') {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date
  }

  return null
}

export const formatAPIDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const formatInputDateValue = formatAPIDate

export const fromNow = (dateObj: Date, locale: string) => {
  const today = new Date()
  const diff = Math.abs(today.getTime() - dateObj.getTime())
  const diffDays = Math.floor(diff / (1000 * 3600 * 24))
  return diffDays === 0 ? 'today' : dateObj.toLocaleDateString(locale)
}
