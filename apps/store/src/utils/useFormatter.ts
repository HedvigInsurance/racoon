import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Formatter } from '@/utils/formatter'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useFormatter = (): Formatter => {
  const { locale } = useCurrentLocale()
  const { i18n } = useTranslation()
  return useMemo(() => new Formatter({ locale, i18n }), [locale, i18n])
}
