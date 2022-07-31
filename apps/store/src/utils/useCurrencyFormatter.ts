import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'

export const useCurrencyFormatter = (currencyCode: string) => {
  const { currencyLocale } = useCurrentLocale()
  return useMemo(() => {
    return new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }, [currencyLocale, currencyCode])
}
