import { locales } from '@/lib/l10n/locales'
import { Locale } from '@/lib/l10n/types'

export const findLocale = (market: string, language: string): Locale | undefined => {
  const marketLocales = Object.values(locales).filter(({ marketLabel }) => marketLabel === market)
  const result = marketLocales.find(({ htmlLang }) => htmlLang === language)
  return result?.locale ?? marketLocales[0]?.locale ?? undefined
}
