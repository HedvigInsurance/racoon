import { Market, MarketLabel } from '@/lib/types'

const MARKET_VALUES = Object.values(Market)
export const isMarket = (item: unknown): item is Market => {
  return MARKET_VALUES.includes(item as Market)
}

export const getMarketLabelFromMarket = (market: Market): MarketLabel => {
  switch (market) {
    case Market.Sweden:
      return MarketLabel.SE
    case Market.Norway:
      return MarketLabel.NO
    case Market.Denmark:
      return MarketLabel.DK
    default:
      throw new Error(`Could not found market label for market: ${market}`)
  }
}

export class QuoteBundleError extends Error {
  constructor(public type: string, public message: string) {
    super(message)
    Object.setPrototypeOf(this, QuoteBundleError.prototype)
  }
}

export const randomEmail = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}
