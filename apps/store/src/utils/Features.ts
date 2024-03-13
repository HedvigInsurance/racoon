import * as process from 'process'

export const Features = {
  enabled(feature: FeatureFlag) {
    return config[feature]
  },
}

const config = {
  COOKIE_BANNER: process.env.NEXT_PUBLIC_FEATURE_COOKIE_BANNER === 'true',
  INSURELY: process.env.NEXT_PUBLIC_FEATURE_INSURELY === 'true',
  MANYPETS_MIGRATION: process.env.NEXT_PUBLIC_FEATURE_MANYPETS_MIGRATION === 'true',
  SAS_PARTNERSHIP: process.env.NEXT_PUBLIC_FEATURE_SAS_PARTNERSHIP === 'true',
  INSURELY_CAR: process.env.NEXT_PUBLIC_FEATURE_INSURELY_CAR === 'true',
  INSURELY_NATIVE_SUCCESS: process.env.NEXT_PUBLIC_FEATURE_INSURELY_NATIVE_SUCCESS === 'true',
  CUSTOM_CHAT: process.env.NEXT_PUBLIC_FEATURE_CUSTOM_CHAT === 'true',
  DAY_PICKER: process.env.NEXT_PUBLIC_FEATURE_DAY_PICKER === 'true',
  QUICK_ADD_BUNDLE_VIEW: process.env.NEXT_PUBLIC_FEATURE_QUICK_ADD_BUNDLE_VIEW === 'true',
  WIDGET_SWITCH: process.env.NEXT_PUBLIC_FEATURE_WIDGET_SWITCH === 'true',
  PRICE_INTENT_WARNING: process.env.NEXT_PUBLIC_FEATURE_PRICE_INTENT_WARNING === 'true',
  BANKID_V6: process.env.NEXT_PUBLIC_FEATURE_BANKID_V6 === 'true',
  MYMONEY: process.env.NEXT_PUBLIC_FEATURE_MYMONEY === 'true',
} as const

export type FeatureFlag = keyof typeof config
