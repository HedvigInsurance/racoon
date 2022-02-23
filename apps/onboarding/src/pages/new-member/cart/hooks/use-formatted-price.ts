import { useCurrentLocale } from '@/lib/l10n'

type FormatCurrencyParams = {
  amount: number
  currency: string
}

export const useFormattedPrice = ({ amount, currency }: FormatCurrencyParams) => {
  const { currencyLocale } = useCurrentLocale()

  return amount.toLocaleString(currencyLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })
}
