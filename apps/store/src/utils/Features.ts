import * as process from 'process'

export const Features = {
  enabled(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  COOKIE_BANNER: process.env.NEXT_PUBLIC_FEATURE_COOKIE_BANNER === 'true',
  COOKIE_BANNER_INP_IMPROVEMENT:
    process.env.NEXT_PUBLIC_FEATURE_COOKIE_BANNER_INP_IMPROVEMENT === 'true',
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  MANYPETS_MIGRATION: process.env.NEXT_PUBLIC_FEATURE_MANYPETS_MIGRATION === 'true',
  SAS_PARTNERSHIP: process.env.NEXT_PUBLIC_FEATURE_SAS_PARTNERSHIP === 'true',
  INSURELY_CAR: process.env.NEXT_PUBLIC_FEATURE_INSURELY_CAR === 'true',
  INSURELY_NATIVE_SUCCESS: process.env.NEXT_PUBLIC_FEATURE_INSURELY_NATIVE_SUCCESS === 'true',
  CUSTOM_CHAT: process.env.NEXT_PUBLIC_FEATURE_CUSTOM_CHAT === 'true',
  MYMONEY: process.env.NEXT_PUBLIC_FEATURE_MYMONEY === 'true',
  CROSS_SELL_CARD_V2: process.env.NEXT_PUBLIC_CROSS_SELL_CARD_V2 === 'true',
  HIDE_REVIEWS_FROM_PRODUCT_AVERAGE_RATING:
    process.env.NEXT_PUBLIC_HIDE_REVIEWS_FROM_PRODUCT_AVERAGE_RATING === 'true',
  NEW_HEADER: process.env.NEXT_PUBLIC_FEATURE_NEW_HEADER === 'true',
} as const

export type FeatureFlag = keyof typeof config
