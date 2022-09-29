import { routingLocale } from '@/lib/l10n/locales'
import { Locale, UiLocale } from '@/lib/l10n/types'

export const isSupportedLocale = (locale: unknown): locale is UiLocale => {
  return (
    typeof locale === 'string' &&
    Object.values(Locale).some((x) => x === locale || routingLocale(x) === locale)
  )
}
