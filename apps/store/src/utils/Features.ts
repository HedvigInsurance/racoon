import * as process from 'process'

export const Features = {
  enabled(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  COOKIE_BANNER: process.env.NEXT_PUBLIC_FEATURE_COOKIE_BANNER === 'true',
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  SAS_PARTNERSHIP: process.env.NEXT_PUBLIC_FEATURE_SAS_PARTNERSHIP === 'true',
  CUSTOM_CHAT: process.env.NEXT_PUBLIC_FEATURE_CUSTOM_CHAT === 'true',
  MYMONEY: process.env.NEXT_PUBLIC_FEATURE_MYMONEY === 'true',
  CROSS_SELL_CARD_V2: process.env.NEXT_PUBLIC_CROSS_SELL_CARD_V2 === 'true',
  HIDE_REVIEWS_FROM_PRODUCT_AVERAGE_RATING:
    process.env.NEXT_PUBLIC_HIDE_REVIEWS_FROM_PRODUCT_AVERAGE_RATING === 'true',
  PRICE_CALCULATOR_PAGE: process.env.NEXT_PUBLIC_FEATURE_PRICE_CALCULATOR_PAGE === 'true',
  PRODUCT_PAGE_V2: process.env.NEXT_PUBLIC_FEATURE_PRODUCT_PAGE_V2 === 'true',
} as const

export type FeatureFlag = keyof typeof config
