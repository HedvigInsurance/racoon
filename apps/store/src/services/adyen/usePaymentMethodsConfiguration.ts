import { type PaymentMethodsConfiguration } from '@adyen/adyen-web/dist/types/core/types'
import { useMemo } from 'react'
import { theme } from 'ui'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const usePaymentMethodsConfiguration = (): PaymentMethodsConfiguration => {
  const { locale } = useCurrentLocale()
  const { countryCode } = useCurrentCountry()

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
          currency: locale,
        },
        buttonType: 'subscribe',
        countryCode,
      },

      googlepay: {
        amount: {
          value: 0,
          currency: locale,
        },
        countryCode,
        environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT === 'live' ? 'PRODUCTION' : 'TEST',
        buttonType: 'subscribe',
      },
    }),
    [locale, countryCode],
  )
}
