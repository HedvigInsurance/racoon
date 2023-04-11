export const Flags = {
  getFeature(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  COUNTRY_SELECTOR: process.env.NEXT_PUBLIC_FEATURE_COUNTRY_SELECTOR === 'true',
  ENGLISH_LANGUAGE: process.env.NEXT_PUBLIC_FEATURE_ENGLISH_LANGUAGE === 'true',
  PET_INSURANCE: process.env.NEXT_PUBLIC_FEATURE_PET_INSURANCE === 'true',
  SUCCESS_ANIMATION: process.env.NEXT_PUBLIC_FEATURE_SUCCESS_ANIMATION === 'true',
} as const

export type FeatureFlag = keyof typeof config
