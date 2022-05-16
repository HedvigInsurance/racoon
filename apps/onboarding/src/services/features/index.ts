import { MarketLabel } from '@/lib/types'

export const Features = {
  isHouseEnabled(marketLabel: MarketLabel) {
    return process.env.NEXT_PUBLIC_FEATURE_HOUSE_INSURANCE?.includes(marketLabel)
  },
  isAccidentEnabled(marketLabel: MarketLabel) {
    return process.env.NEXT_PUBLIC_FEATURE_ACCIDENT_INSURANCE?.includes(marketLabel)
  },
}
