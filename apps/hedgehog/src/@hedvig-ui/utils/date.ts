import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addYears,
  differenceInCalendarDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  formatDistance,
  getYear,
  isFuture,
  parse,
  parseISO,
  setYear,
} from 'date-fns'
import { formatDate } from 'date-fns/format'
import { capitalize } from '@hedvig-ui'
import { abs } from 'mathjs'

export enum BirthDayInfo {
  Today = 'TODAY',
  Yesterday = 'YESTERDAY',
  Tomorrow = 'TOMORROW',
}

export const getBirthdayInfo = (
  birthDateString: string,
  today: Date = new Date(),
): BirthDayInfo | null => {
  let birthDate
  try {
    birthDate = parse(birthDateString, 'yyyy-MM-dd', new Date())
  } catch (e) {
    return null
  }
  const thisYear = getYear(today)
  if (
    differenceInCalendarDays(setYear(birthDate, thisYear), today) === 1 ||
    differenceInCalendarDays(setYear(birthDate, thisYear + 1), today) === 1
  ) {
    return BirthDayInfo.Tomorrow
  }
  if (
    differenceInCalendarDays(setYear(birthDate, thisYear), today) === -1 ||
    differenceInCalendarDays(setYear(birthDate, thisYear - 1), today) === -1
  ) {
    return BirthDayInfo.Yesterday
  }
  if (differenceInCalendarDays(setYear(birthDate, thisYear), today) === 0) {
    return BirthDayInfo.Today
  }
  return null
}

export const getBirthDayText = (birthDateString: string): string | null => {
  const birthDayInfo = getBirthdayInfo(birthDateString)
  switch (birthDayInfo) {
    case BirthDayInfo.Today:
      return 'Birthday today 🥳'
    case BirthDayInfo.Tomorrow:
      return 'Birthday tomorrow 🎁'
    case BirthDayInfo.Yesterday:
      return 'Birthday yesterday 🎂'
  }
  return null
}

export const dateTimeFormatter = (date: string | number, format: string) => {
  try {
    return (
      date &&
      formatDate(typeof date === 'string' ? parseISO(date) : date, format)
    )
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const formatDistanceWithFraction = (
  date: Date,
  other?: Date | null,
): string => {
  const now = other ?? new Date()

  const years = differenceInYears(now, date)
  const months = differenceInMonths(now, date) % 12
  return years + Math.floor((months / 12) * 10) / 10 + ''
}

export const formatDistanceWithAccuracy = (
  date: Date,
  other?: Date | null,
): string => {
  const result = []
  const now = other ?? new Date()

  const years = differenceInYears(now, date)

  if (years > 0) {
    result.push(`${years} ${years === 1 ? 'year' : 'years'}`)
    date = addYears(date, years)
  }

  const months = differenceInMonths(now, date)
  if (months > 0) {
    result.push(`${months} ${months === 1 ? 'month' : 'months'}`)
    date = addMonths(date, months)
  }

  const days = differenceInDays(now, date)

  if (days > 0) {
    result.push(`${days} ${days === 1 ? 'day' : 'days'}`)
  }

  if (!result.length) {
    return capitalize(
      formatDistance(new Date(date), new Date(), { addSuffix: true }),
    )
  }

  if (!other) result.push('ago')

  return result.join(' ')
}

export function formatDistanceTo(
  date: string,
  options: { addSuffix?: boolean; compact?: boolean },
): string {
  type Part = {
    value: number
    unit: TimeUnit
  }

  function stringify(part: Part): string {
    const { value, unit } = part
    const absValue = abs(value)
    const name = TimeUnitNames[unit]
    if (options.compact) {
      return `${absValue}${name.short}` // like 1h or 3d
    }

    return absValue === 1
      ? `${absValue} ${name.long}` // 1 day
      : `${absValue} ${name.long}s` // 3 days
  }

  function format(major: Part, minor?: Part): string {
    const timeString =
      minor && minor.value !== 0
        ? `${stringify(major)} ${stringify(minor)}` // 2h 33m / 2 hours 33 minutes
        : stringify(major) // 2h / 2 hours
    if (options.addSuffix) {
      return isFuture(date) ? `in ${timeString}` : `${timeString} ago`
    }
    return timeString
  }

  let time = parseISO(date)
  const now = new Date()

  const yearsAgo = differenceInYears(now, time)
  time = addYears(time, yearsAgo)
  const monthsAgo = differenceInMonths(now, time)
  if (yearsAgo != 0) {
    return format(
      { value: yearsAgo, unit: 'year' },
      { value: monthsAgo, unit: 'month' },
    )
  }
  time = addMonths(time, monthsAgo)
  const daysAgo = differenceInDays(now, time)
  if (monthsAgo != 0) {
    return format(
      { value: monthsAgo, unit: 'month' },
      { value: daysAgo, unit: 'day' },
    )
  }
  time = addDays(time, daysAgo)
  const hoursAgo = differenceInHours(now, time)
  if (daysAgo != 0) {
    return format(
      { value: daysAgo, unit: 'day' },
      { value: hoursAgo, unit: 'hour' },
    )
  }
  time = addHours(time, hoursAgo)
  const minutesAgo = differenceInMinutes(now, time)
  if (hoursAgo != 0) {
    return format(
      { value: hoursAgo, unit: 'hour' },
      { value: minutesAgo, unit: 'minute' },
    )
  }
  time = addMinutes(time, minutesAgo)
  const secondsAgo = differenceInSeconds(now, time)
  if (minutesAgo != 0) {
    return format(
      { value: minutesAgo, unit: 'minute' },
      { value: secondsAgo, unit: 'second' },
    )
  }
  return format({ value: secondsAgo, unit: 'second' })
}

type TimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
type TimeUnitName = {
  long: string
  short: string
}

const TimeUnitNames: Record<TimeUnit, TimeUnitName> = {
  year: {
    long: 'year',
    short: 'y',
  },
  month: {
    long: 'month',
    short: 'M',
  },
  day: {
    long: 'day',
    short: 'd',
  },
  hour: {
    long: 'hour',
    short: 'h',
  },
  minute: {
    long: 'minute',
    short: 'm',
  },
  second: {
    long: 'second',
    short: 's',
  },
}
