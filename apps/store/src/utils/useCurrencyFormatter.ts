import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'

export const useCurrencyFormatter = (currency: string) => {
  const { currencyLocale } = useCurrentLocale()
  return useMemo(() => {
    return new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }, [currencyLocale, currency])
}
