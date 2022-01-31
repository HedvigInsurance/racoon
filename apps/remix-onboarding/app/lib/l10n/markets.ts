import { Locale } from '../types'
import { MarketLabel } from './locales'

export type MarketData = {
  languages: Array<{ urlParam: Locale; displayName: string }>
}

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
