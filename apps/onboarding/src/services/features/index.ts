import { MarketLabel } from '@/lib/types'

export enum Feature {
  ACCIDENT_INSURANCE = 'ACCIDENT_INSURANCE',
  HOUSE_INSURANCE = 'HOUSE_INSURANCE',
}

export const Features = {
  getMarketBasedFlags(marketLabel: MarketLabel): Record<Feature, boolean> {
    const normalize = (marketList: string = '') => marketList.includes(marketLabel)

    return {
      ACCIDENT_INSURANCE: normalize(process.env.NEXT_PUBLIC_FEATURE_ACCIDENT_INSURANCE),
      HOUSE_INSURANCE: normalize(process.env.NEXT_PUBLIC_FEATURE_HOUSE_INSURANCE),
    }
  },
  getFeature(feature: Feature, marketLabel: MarketLabel) {
    return this.getMarketBasedFlags(marketLabel)[feature]
  },
}
