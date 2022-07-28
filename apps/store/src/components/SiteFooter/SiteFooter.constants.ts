import { locales } from '@/lib/l10n/locales'
import { Locale, MarketLabel } from '@/lib/l10n/types'

export const TEMP_TRANSLATIONS: Record<string, string> = {
  MARKET_LABEL_SE: 'Sweden',
  MARKET_LABEL_NO: 'Norway',
  MARKET_LABEL_DK: 'Denmark',

  LANGUAGE_LABEL_sv: 'Swedish',
  LANGUAGE_LABEL_en: 'English',
  LANGUAGE_LABEL_no: 'Norwegian',
  LANGUAGE_LABEL_da: 'Danish',
}

export const MARKET_MAP = Object.values(locales).reduce((markets, { marketLabel, htmlLang }) => {
  if (marketLabel in markets) {
    return { ...markets, [marketLabel]: [...markets[marketLabel], htmlLang] }
  }
  return { ...markets, [marketLabel]: [htmlLang] }
}, {} as Record<MarketLabel, Array<Locale>>)

export enum Field {
  Market = 'market',
  Language = 'language',
}
