import { format } from 'date-fns'

export const convertToDate = (value: unknown): Date | null => {
  if (typeof value === 'string') {
    const date = new Date(value)
    if (isNaN(date.getTime())) return null
    return date
  }

  return null
}

export const formatAPIDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const formatInputDateValue = formatAPIDate
