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
  MEMBER_AREA: process.env.NEXT_PUBLIC_FEATURE_MEMBER_AREA === 'true',
  SAS_PARTNERSHIP: process.env.NEXT_PUBLIC_FEATURE_SAS_PARTNERSHIP === 'true',
  INSURELY_CAR: process.env.NEXT_PUBLIC_FEATURE_INSURELY_CAR === 'true',
  HOMECOMING: process.env.NEXT_PUBLIC_FEATURE_HOMECOMING === 'true',
  CUSTOM_ASSET_DOMAIN: process.env.NEXT_PUBLIC_FEATURE_CUSTOM_ASSET_DOMAIN === 'true',
  INSURELY_NATIVE_SUCCESS: process.env.NEXT_PUBLIC_FEATURE_INSURELY_NATIVE_SUCCESS === 'true',
} as const

export type FeatureFlag = keyof typeof config
