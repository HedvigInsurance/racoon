import { i18n as I18NextClient } from 'i18next'
import { CurrencyCode } from '@/services/apollo/generated'
import { IsoLocale } from '@/utils/l10n/types'

type MoneyFormatOptions = { locale: IsoLocale }

export type Money = {
  amount: number
  currencyCode: CurrencyCode
}

export const formatMoney = (money: Money, options: MoneyFormatOptions): string => {
  return new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: money.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(money.amount)
}

export const formatMonthlyPrice = (
  price: Money,
  options: MoneyFormatOptions & { i18n: I18NextClient },
): string => {
  const displayAmount = formatMoney(price, options)
  return options.i18n.t('MONTHLY_PRICE', {
    displayAmount,
    lng: options.locale,
    defaultValue: `MONTHLY_PRICE ${displayAmount}`,
  })
}

type DateFormatOptions = { locale: IsoLocale }

export const formatDateFromNow = (date: Date, options: DateFormatOptions): string => {
  const today = new Date()
  const diff = Math.abs(today.getTime() - date.getTime())
  const diffDays = Math.floor(diff / (1000 * 3600 * 24))
  if (diffDays == 0) {
    return new Intl.RelativeTimeFormat(options.locale, { numeric: 'auto' }).format(0, 'day')
  }
  return date.toLocaleDateString(options.locale)
}

type FormatterOptions = MoneyFormatOptions & { i18n: I18NextClient }

export class Formatter {
  constructor(public options: FormatterOptions) {
    // Has to be assigned explicitly for Storybook compatibility, looks like it messes up TS constructor properties
    this.options = options
  }

  money = (money: Money) => formatMoney(money, this.options)
  monthlyPrice = (price: Money) => formatMonthlyPrice(price, this.options)
  fromNow = (date: Date) => formatDateFromNow(date, this.options)
}
