import * as process from 'process'

export const Features = {
  enabled(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  COUNTRY_SELECTOR: process.env.NEXT_PUBLIC_FEATURE_COUNTRY_SELECTOR === 'true',
  ENGLISH_LANGUAGE: process.env.NEXT_PUBLIC_FEATURE_ENGLISH_LANGUAGE === 'true',
  MANYPETS_MIGRATION: process.env.NEXT_PUBLIC_FEATURE_MANYPETS_MIGRATION === 'true',
  SAS_PARTNERSHIP: process.env.NEXT_PUBLIC_FEATURE_SAS_PARTNERSHIP === 'true',
  INSURELY_CAR: process.env.NEXT_PUBLIC_FEATURE_INSURELY_CAR === 'true',
  HOMECOMING: process.env.NEXT_PUBLIC_FEATURE_HOMECOMING === 'true',
  DISCOUNTS: process.env.NEXT_PUBLIC_FEATURE_DISCOUNTS === 'true',
} as const

export type FeatureFlag = keyof typeof config
