import * as process from 'process'

export const Features = {
  enabled(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  // We're using it to disable cookie banner outside of production and staging
  COOKIE_BANNER: process.env.NEXT_PUBLIC_FEATURE_COOKIE_BANNER === 'true',
  // Keeping it around as a way to quickly disable Insurely if anything goes wrong
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',

  PRICE_CALCULATOR_PAGE: process.env.NEXT_PUBLIC_FEATURE_PRICE_CALCULATOR_PAGE === 'true',
  PRODUCT_PAGE_V2: process.env.NEXT_PUBLIC_FEATURE_PRODUCT_PAGE_V2 === 'true',
  WIDGET_FEATURE_HOME_TIERS: process.env.NEXT_PUBLIC_WIDGET_FEATURE_HOME_TIERS === 'true',
} as const

export type FeatureFlag = keyof typeof config
