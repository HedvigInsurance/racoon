import {
  addWeeks,
  nextSaturday,
  nextThursday,
  nextSunday,
  format,
} from 'date-fns'
import { formatWithOptions } from 'date-fns/fp'
import { sv } from 'date-fns/locale'

export const fixedHolidays: string[] = [
  '01-01', // Nyårsdagen
  '01-06', // Trettondag jul
  '05-01', // Första maj
  '06-06', // Nationaldagen
  '12-24', // Julafton
  '12-25', // Juldagen
  '12-26', // Annandag jul
  '12-31', // Nyårsafton
]
function truncDivision(a: number, b: number) {
  return Math.trunc(a / b)
}

/**
 * Calculates the date of Easter using the "Meeus/Jones/butcher" algorithm - O(1).
 * See @link https://en.wikipedia.org/wiki/Date_of_Easter#Anonymous_Gregorian_algorithm
 *
 * @param year - The year for which to calculate the Easter date.
 * @returns All the important dates around Easter.
 */
export function getEasterDates(year: number = new Date().getFullYear()) {
  if (year < 1583 || year > 4099) {
    throw new Error('The year should be between 1583 and 4099')
  }
  const a = year % 19
  const b = truncDivision(year, 100)
  const c = year % 100
  const d = truncDivision(b, 4)
  const e = b % 4
  const f = truncDivision(b + 8, 25)
  const g = truncDivision(b - f + 1, 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = truncDivision(c, 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = truncDivision(a + 11 * h + 22 * l, 451)
  const n = h + l - 7 * m + 114

  const month = truncDivision(n, 31) - 1
  const day = 1 + (n % 31)

  const easterDate = new Date(year, month, day)
  const langfredag = new Date(easterDate.setDate(easterDate.getDate() - 2))
  const annandagPask = new Date(easterDate.setDate(easterDate.getDate() + 1))
  const kristiHimmelsfard = nextThursday(addWeeks(easterDate, 5))
  const pingst = nextSunday(addWeeks(easterDate, 7))
  return {
    easterDate,
    langfredag,
    annandagPask,
    kristiHimmelsfard,
    pingst,
  }
}

export function isSwedishHoliday(date: Date): boolean {
  const formattedDate = formatWithOptions({ locale: sv })('MM-dd', date)

  // Fixed holidays
  if (fixedHolidays.includes(formattedDate.slice(5))) {
    return true
  }

  // Easter days
  const { easterDate, langfredag, annandagPask, kristiHimmelsfard, pingst } =
    getEasterDates(date.getFullYear())

  if (
    formattedDate === format(easterDate, 'MM-dd') ||
    formattedDate === format(langfredag, 'MM-dd') ||
    formattedDate === format(annandagPask, 'MM-dd') ||
    formattedDate === format(kristiHimmelsfard, 'MM-dd') ||
    formattedDate === format(pingst, 'MM-dd')
  ) {
    return true
  }

  // Holidays that are on a specific weekday
  const midsommar = nextSaturday(new Date(date.getFullYear(), 5, 20))
  const allaHelgonsDag = nextSaturday(new Date(date.getFullYear(), 10, 31))

  if (
    formattedDate === format(midsommar, 'MM-dd') ||
    formattedDate === format(allaHelgonsDag, 'MM-dd')
  ) {
    return true
  }

  return false
}
