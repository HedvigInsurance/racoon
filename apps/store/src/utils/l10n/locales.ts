import { IsoLocale, Language, Locale, RoutingLocale } from './types'

export const FALLBACK_LOCALE = Locale.EnSe
export const LOCALE_COOKIE_KEY = 'NEXT_LOCALE'
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // one year in seconds

export type LocaleData = {
  locale: IsoLocale
  language: Language
  routingLocale: RoutingLocale
}

export const locales: Record<IsoLocale, LocaleData> = {
  [Locale.SvSe]: {
    locale: Locale.SvSe,
    language: Language.Sv,
    routingLocale: 'se',
  },
  [Locale.EnSe]: {
    locale: Locale.EnSe,
    language: Language.En,
    routingLocale: 'se-en',
  },
  [Locale.NbNo]: {
    locale: Locale.NbNo,
    language: Language.No,
    routingLocale: 'no',
  },
  [Locale.EnNo]: {
    locale: Locale.EnNo,
    language: Language.En,
    routingLocale: 'no-en',
  },
  [Locale.DaDk]: {
    locale: Locale.DaDk,
    language: Language.Da,
    routingLocale: 'dk',
  },
  [Locale.EnDk]: {
    locale: Locale.EnDk,
    language: Language.En,
    routingLocale: 'dk-en',
  },
}

export enum LocaleField {
  Country = 'country',
  Language = 'language',
}
