import { isSupportedLocale } from '@/utils/isSupportedLocale'
import { IsoLocale, Language, Locale, RoutingLocale, UiLocale } from './types'

export const FALLBACK_LOCALE = Locale.EnSe

export type LocaleData = {
  locale: IsoLocale
  language: Language
}

export const locales: Record<IsoLocale, LocaleData> = {
  [Locale.SvSe]: {
    locale: Locale.SvSe,
    language: Language.Sv,
  },
  [Locale.EnSe]: {
    locale: Locale.EnSe,
    language: Language.En,
  },
  [Locale.NbNo]: {
    locale: Locale.NbNo,
    language: Language.No,
  },
  [Locale.EnNo]: {
    locale: Locale.EnNo,
    language: Language.En,
  },
  [Locale.DaDk]: {
    locale: Locale.DaDk,
    language: Language.Da,
  },
  [Locale.EnDk]: {
    locale: Locale.EnDk,
    language: Language.En,
  },
}

// TODO: Move to Lokalise
export const TEMP_TRANSLATIONS: Record<string, string> = {
  COUNTRY_LABEL_SE: 'Sweden',
  COUNTRY_LABEL_NO: 'Norway',
  COUNTRY_LABEL_DK: 'Denmark',

  LANGUAGE_LABEL_sv: 'Swedish',
  LANGUAGE_LABEL_en: 'English',
  LANGUAGE_LABEL_no: 'Norwegian',
  LANGUAGE_LABEL_da: 'Danish',
}

export enum LocaleField {
  Country = 'country',
  Language = 'language',
}

export const toIsoLocale = (locale: UiLocale): IsoLocale => {
  const parts = locale.split('-', 2)
  return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}` as IsoLocale
}

export const toRoutingLocale = (locale: UiLocale) => locale.toLowerCase() as RoutingLocale

// TODO: Make fallback market-specific
export const getLocaleOrFallback = (locale: UiLocale | string | undefined): LocaleData => {
  if (!isSupportedLocale(locale)) {
    return locales[FALLBACK_LOCALE]
  }
  return locales[toIsoLocale(locale)]
}
