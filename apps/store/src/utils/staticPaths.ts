import type { GetStaticPaths } from 'next'
import { countries } from './l10n/countries'
import { locales } from './l10n/locales'
import { toRoutingLocale } from './l10n/localeUtils'
import { CountryLabel } from './l10n/types'

export const staticPathsPerSwedenLocale: GetStaticPaths = () =>
  ({
    paths: countries[CountryLabel.SE].locales.map((locale) => ({
      params: {
        locale: toRoutingLocale(locale),
      },
    })),
    fallback: false,
  }) as const

export const staticPathPerLocaleAllCountries: GetStaticPaths = () =>
  ({
    paths: Object.values(locales).map(({ routingLocale }) => ({
      params: {
        locale: routingLocale,
      },
    })),
    fallback: false,
  }) as const
