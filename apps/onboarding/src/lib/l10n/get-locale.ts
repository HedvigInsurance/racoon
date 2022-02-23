import { LocaleLabel, locales } from './locales'

export const getLocale = (locale: LocaleLabel) => locales[locale]
