export const Flags = {
  getFeature(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  ENGLISH_LANGUAGE: process.env.NEXT_PUBLIC_FEATURE_ENGLISH_LANGUAGE === 'true',
} as const

export type FeatureFlag = keyof typeof config
