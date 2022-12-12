import { MarketLabel } from '@/lib/types'

export enum Feature {
  ACCIDENT_INSURANCE = 'ACCIDENT_INSURANCE',
  HOUSE_INSURANCE = 'HOUSE_INSURANCE',
  CROSS_SELL = 'CROSS_SELL',
}

export const Features = {
  getMarketBasedFlags(marketLabel: MarketLabel): Record<Feature, boolean> {
    const normalize = (marketList = '') => marketList.includes(marketLabel)

    return {
      ACCIDENT_INSURANCE: normalize(process.env.NEXT_PUBLIC_FEATURE_ACCIDENT_INSURANCE),
      HOUSE_INSURANCE: normalize(process.env.NEXT_PUBLIC_FEATURE_HOUSE_INSURANCE),
      CROSS_SELL: normalize(process.env.NEXT_PUBLIC_FEATURE_CROSS_SELL),
    }
  },
  getFeature(feature: Feature, marketLabel: MarketLabel) {
    return this.getMarketBasedFlags(marketLabel)[feature]
  },
}
