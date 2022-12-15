import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Formatter } from '@/utils/formatter'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useFormatter = (): Formatter => {
  const { locale } = useCurrentLocale()
  const { currencyCode } = useCurrentCountry()
  const { i18n } = useTranslation()
  return useMemo(() => new Formatter({ locale, currencyCode, i18n }), [currencyCode, locale, i18n])
}
