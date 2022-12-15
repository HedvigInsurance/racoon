import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Formatter } from '@/utils/formatter'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useFormatter = (): Formatter => {
  const { locale } = useCurrentLocale()
  const { t } = useTranslation()
  return useMemo(() => new Formatter({ locale, t }), [locale, t])
}
