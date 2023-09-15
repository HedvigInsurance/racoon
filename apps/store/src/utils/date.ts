export const convertToDate = (value: unknown): Date | null => {
  if (typeof value === 'string') {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date
  }

  return null
}

export const formatAPIDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatInputDateValue = formatAPIDate
