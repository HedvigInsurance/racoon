import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'

export const useCurrencyFormatter = (currencyCode: string) => {
  const { locale } = useCurrentLocale()
  return useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }, [locale, currencyCode])
}
