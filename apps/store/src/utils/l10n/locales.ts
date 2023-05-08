import { IsoLocale, Language, Locale, RoutingLocale } from './types'

export const FALLBACK_LOCALE = Locale.EnSe
export const LOCALE_COOKIE_KEY = 'NEXT_LOCALE'
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // one year in seconds

export type LocaleData = {
  locale: IsoLocale
  language: Language
  routingLocale: RoutingLocale
  chatWidgetSrc?: string
}

export const locales: Record<IsoLocale, LocaleData> = {
  [Locale.SvSe]: {
    locale: Locale.SvSe,
    language: Language.Sv,
    routingLocale: 'se',
    chatWidgetSrc:
      'https://c1.hedvig.com/static/public/widgets/chat/chat-worker.js?id=b608e095-4995-474d-bbff-1ccd875d8a18&height=560&isMobile=false&preview=0&widgetUrl=https://c1.hedvig.com/static/public/widgets/chat/build/',
  },
  [Locale.EnSe]: {
    locale: Locale.EnSe,
    language: Language.En,
    routingLocale: 'se-en',
    chatWidgetSrc:
      'https://c1.hedvig.com:443/static/public/widgets/chat/chat-worker.js?id=b74b00c0-c211-424d-b1b5-37bd6f5d10cb&height=600&isMobile=false&preview=0&widgetUrl=https://c1.hedvig.com/static/public/widgets/chat/build/',
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
