import { i18n as I18NextClient } from 'i18next'
import { CurrencyCode } from '@/services/apollo/generated'
import { IsoLocale } from '@/utils/l10n/types'

type MoneyFormatOptions = { currencyCode: CurrencyCode; locale: IsoLocale }

export const formatAmount = (amount: number, options: MoneyFormatOptions): string => {
  return new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatMonthlyPrice = (
  amount: number,
  options: MoneyFormatOptions & { i18n: I18NextClient },
): string => {
  const displayAmount = formatAmount(amount, options)
  return options.i18n.t('MONTHLY_PRICE', {
    displayAmount,
    lng: options.locale,
    defaultValue: `MONTHLY_PRICE ${displayAmount}`,
  })
}

type FormatterOptions = MoneyFormatOptions & { i18n: I18NextClient }

export class Formatter {
  constructor(public options: FormatterOptions) {}

  amount = (amount: number) => formatAmount(amount, this.options)
  monthlyPrice = (amount: number) => formatMonthlyPrice(amount, this.options)
}
