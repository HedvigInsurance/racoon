import { LOCALE_URL_PARAMS } from './locales'

export type LocaleUrlParam = typeof LOCALE_URL_PARAMS[number]

export type MarketData = {
  languages: Array<{ urlParam: LocaleUrlParam; displayName: string }>
}

export type MarketLabel = 'SE' | 'NO' | 'DK'

export const markets: Record<MarketLabel, MarketData> = {
  SE: {
    languages: [
      { urlParam: 'se', displayName: 'Sv' },
      { urlParam: 'se-en', displayName: 'En' },
    ],
  },
  NO: {
    languages: [
      { urlParam: 'no', displayName: 'No' },
      { urlParam: 'no-en', displayName: 'En' },
    ],
  },
  DK: {
    languages: [
      { urlParam: 'dk', displayName: 'Da' },
      { urlParam: 'dk-en', displayName: 'En' },
    ],
  },
}
