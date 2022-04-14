import { MarketLabel } from '@/lib/types'

export const ssnFormats: Record<MarketLabel, RegExp> = {
  SE: /^((19|20))([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])([0-9]{4})$/,
  NO: /^(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])([0-9]{2})([0-9]{5})$/,
  DK: /^(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])([0-9]{2})([0-9]{4})$/,
}

export const ssnLengths: Record<MarketLabel, number> = {
  SE: 12,
  NO: 11,
  DK: 10,
}

const yearMonthDayFormat = /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
const dayMonthYearFormat = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-(19[0-9]{2}|20[0-9]{2})$/

export const birthDateFormats: Record<MarketLabel | 'backEndDefault', RegExp> = {
  backEndDefault: yearMonthDayFormat,
  SE: yearMonthDayFormat,
  NO: dayMonthYearFormat,
  DK: dayMonthYearFormat,
}
