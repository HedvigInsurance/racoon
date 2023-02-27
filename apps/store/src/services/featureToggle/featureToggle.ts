import { CountryLabel } from '@/utils/l10n/types'

export enum Feature {
  ENGLISH_LANGUAGE = 'ENGLISH_LANGUAGE',
}

export class FeatureToggle {
  private static getCountryBasedFlags(country: CountryLabel) {
    return {
      ENGLISH_LANGUAGE:
        process.env.NEXT_PUBLIC_FEATURE_ENGLISH_LANGUAGE?.includes(country) ?? false,
    } as const
  }

  public get(feature: Feature, country: CountryLabel) {
    return FeatureToggle.getCountryBasedFlags(country)[feature]
  }
}
