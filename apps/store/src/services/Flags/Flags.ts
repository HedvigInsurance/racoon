export const Flags = {
  getFeature(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
} as const

export type FeatureFlag = keyof typeof config
