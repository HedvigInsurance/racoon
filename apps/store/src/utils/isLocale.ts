import { Locale, LocaleValue } from '@/lib/l10n/types'

const LOCALE_VALUES = Object.values(Locale)

export const isLocale = (locale: unknown): locale is LocaleValue => {
  return typeof locale === 'string' && LOCALE_VALUES.includes(locale as LocaleValue)
}
