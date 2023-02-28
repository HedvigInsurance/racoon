export const Flags = {
  getFeature(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  ENGLISH_LANGUAGE: process.env.NEXT_PUBLIC_FEATURE_ENGLISH_LANGUAGE === 'true',
  SUCCESS_ANIMATION: process.env.NEXT_PUBLIC_FEATURE_SUCCESS_ANIMATION === 'true',
} as const

export type FeatureFlag = keyof typeof config
