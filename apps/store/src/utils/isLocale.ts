import { Locale } from '@/lib/l10n/types'

const LOCALE_VALUES = Object.values(Locale)

export const isLocale = (locale: unknown): locale is Locale => {
  return typeof locale === 'string' && LOCALE_VALUES.includes(locale as Locale)
}
