import { datadogLogs } from '@datadog/browser-logs'
import { TFunction } from 'next-i18next'
import Personnummer from 'personnummer'
import { CurrencyCode } from '@/services/apollo/generated'
import { IsoLocale } from '@/utils/l10n/types'

type MoneyFormatOptions = { locale: IsoLocale }

export type Money = {
  amount: number
  currencyCode: CurrencyCode
}

const formatMoney = (money: Money, options: MoneyFormatOptions): string => {
  return new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: money.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(money.amount)
}

const formatMonthlyPrice = (
  price: Money,
  options: MoneyFormatOptions & { t: TFunction },
): string => {
  const displayAmount = formatMoney(price, options)
  return options.t('MONTHLY_PRICE', {
    displayAmount,
    lng: options.locale,
    defaultValue: `MONTHLY_PRICE ${displayAmount}`,
  })
}

type DateFormatOptions = { locale: IsoLocale } & { t: TFunction }

const formatDateFromNow = (date: Date, options: DateFormatOptions): string => {
  const today = new Date()
  const isSameDay =
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) ===
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

  if (isSameDay) {
    return options.t('DATE_SAME_DAY')
  }

  // FYI: dates are formatted the same across locales
  const result = date.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Stockholm',
  })

  return result.replace(/-/g, '.')
}

const formatTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

const formatSsn = (ssn: string): string => {
  try {
    const longFormat = Personnummer.parse(ssn).format(true)
    // replace the last 4 digits with asterisks
    return longFormat.replace(/(\d{4})$/, '****')
  } catch (error) {
    datadogLogs.logger.warn('Could not format SSN', { ssn, error })
    return ssn
  }
}

const formatCarRegistrationNumber = (regNumber: string): string => {
  // add space after 3rd character
  return regNumber.toUpperCase().replace(/(.{3})/, '$1 ')
}

const formatZipCode = (value: string): string => {
  return value.replace(/(\d{3})(\d{2})/, '$1 $2')
}

const formatNumberGrouping = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { useGrouping: true }).format(value)

type FormatterOptions = MoneyFormatOptions & { t: TFunction }

export class Formatter {
  constructor(public options: FormatterOptions) {
    // Has to be assigned explicitly for Storybook compatibility, looks like it messes up TS constructor properties
    this.options = options
  }

  public money = (money: Money) => formatMoney(money, this.options)
  public monthlyPrice = (price: Money) => formatMonthlyPrice(price, this.options)
  public fromNow = (date: Date) => formatDateFromNow(date, this.options)
  public dateFull = (date: Date, options?: { hideYear?: boolean; abbreviateMonth?: boolean }) => {
    const formattedDate = date.toLocaleDateString(this.options.locale, {
      year: options?.hideYear ? undefined : 'numeric',
      month: options?.abbreviateMonth ? 'short' : 'long',
      day: 'numeric',
      timeZone: 'Europe/Stockholm',
    })

    // Removes '.' used for abbreviations
    if (options?.abbreviateMonth) {
      return formattedDate.replace('.', '')
    }

    return formattedDate
  }

  public titleCase = (str: string) => formatTitleCase(str)
  public ssn = formatSsn
  public carRegistrationNumber = formatCarRegistrationNumber
  public zipCode = formatZipCode
  public numberGrouping = (value: number) => formatNumberGrouping(value, this.options.locale)
}
