import { LocaleLabel, LOCALE_URL_PARAMS } from './l10n/locales'

export const isLocaleLabel = (locale: unknown): locale is LocaleLabel => {
  return typeof locale === 'string' && LOCALE_URL_PARAMS.includes(locale as LocaleLabel)
}
