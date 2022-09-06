import { useTheme } from '@emotion/react'
import { useMemo } from 'react'
import { Locale } from '@/lib/l10n/types'
import { useCurrentCountry } from '@/lib/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'

export const usePaymentMethodConfiguration = () => {
  const { currencyLocale } = useCurrentLocale()
  const { countryCode } = useCurrentCountry()
  const theme = useTheme()

  return useMemo(
    () => ({
      card: {
        styles: {
          base: {
            color: theme.colors.gray700,
            background: theme.colors.gray100,
          },
          placeholder: {
            color: theme.colors.gray700,
          },
          error: {
            color: theme.colors.gray700,
          },
        },
      },

      applepay: {
        amount: {
          value: 0,
          currency: currencyLocale,
        },
        buttonType: 'subscribe',
        countryCode,
      },

      googlepay: {
        amount: {
          value: 0,
          currency: currencyLocale,
        },
        countryCode,
        environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT === 'live' ? 'PRODUCTION' : 'TEST',
        buttonType: 'subscribe',
      },
    }),
    [theme, currencyLocale, countryCode],
  )
}

export const localeToAdyenLocale = (locale: Locale) => {
  switch (locale) {
    case Locale.DaDk:
      return 'da-DK'
    case Locale.NbNo:
      return 'no-NO'
    case Locale.SvSe:
      return 'sv-SE'
    default:
      return 'en-US'
  }
}
