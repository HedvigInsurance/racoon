import { MonetaryAmountV2 } from 'types/generated/graphql'
import { MonetaryAmount } from 'types/scalars'

type Money = MonetaryAmountV2 | MonetaryAmount

export const formatMoney = (
  amount: Money,
  options: Intl.NumberFormatOptions | null = null,
): string =>
  formatMoneyNumber(Number(amount.amount), options) + ' ' + amount.currency

export const formatMoneyNumber = (
  amount: number,
  options: Intl.NumberFormatOptions | null = null,
) => {
  return amount.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  })
}
