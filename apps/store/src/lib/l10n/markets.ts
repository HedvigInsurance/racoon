import { getLocale } from './locales'
import { CountryCode, Locale, Market, MarketLabel } from './types'

export type MarketData = {
  id: MarketLabel
  // Unused.  Do we need it?
  apiMarket: Market
  adtractionScriptSrc?: string
  countryCode: CountryCode
  defaultLocale: Locale
  locales: Locale[]
  // TODO: Discuss moving language-independent parts of SSNs, birth dates here
}

export const markets: Record<MarketLabel, MarketData> = {
  [MarketLabel.SE]: {
    id: MarketLabel.SE,
    apiMarket: Market.Sweden,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1412531808',
    countryCode: CountryCode.Se,
    defaultLocale: Locale.SvSe,
    locales: [Locale.SvSe, Locale.EnSe],
  },
  [MarketLabel.NO]: {
    id: MarketLabel.NO,
    apiMarket: Market.Norway,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1492109567',
    countryCode: CountryCode.No,
    defaultLocale: Locale.NbNo,
    locales: [Locale.NbNo, Locale.EnNo],
  },
  [MarketLabel.DK]: {
    id: MarketLabel.DK,
    apiMarket: Market.Denmark,
    adtractionScriptSrc: 'https://cdn.adt387.com/jsTag?ap=1589794294',
    countryCode: CountryCode.Dk,
    defaultLocale: Locale.DaDk,
    locales: [Locale.DaDk, Locale.EnDk],
  },
}

export const getMarketByLocale = (locale: string | undefined | null): MarketData => {
  const marketId = (locale?.split('-')[1] ?? '').toUpperCase()
  const marketData = markets[marketId as MarketLabel]
  if (!marketData) {
    throw new Error(`Failed to find market by locale=${locale}`)
  }
  return marketData
}

export const findMarketLocale = (market: string, language: string): Locale | undefined => {
  const marketData = markets[market as MarketLabel]
  if (!marketData) {
    throw new Error(`Failed to find market id=${market}`)
  }
  return (
    marketData.locales.find((locale) => getLocale(locale).language === language) ||
    marketData.defaultLocale
  )
}
