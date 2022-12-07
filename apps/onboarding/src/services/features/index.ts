import { MarketLabel } from '@/lib/types'

export enum Feature {
  CROSS_SELL = 'CROSS_SELL',
}

export const Features = {
  getMarketBasedFlags(marketLabel: MarketLabel): Record<Feature, boolean> {
    const normalize = (marketList = '') => marketList.includes(marketLabel)

    return {
      CROSS_SELL: normalize(process.env.NEXT_PUBLIC_FEATURE_CROSS_SELL),
    }
  },
  getFeature(feature: Feature, marketLabel: MarketLabel) {
    return this.getMarketBasedFlags(marketLabel)[feature]
  },
}
