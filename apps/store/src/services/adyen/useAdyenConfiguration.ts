import { type CoreOptions } from '@adyen/adyen-web/dist/types/core/types'
import { datadogLogs } from '@datadog/browser-logs'
import { useMemo } from 'react'
import { type IsoLocale, Locale } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { usePaymentMethodsConfiguration } from './usePaymentMethodsConfiguration'

export const useAdyenConfiguration = (shopSessionId: string) => {
  const { locale } = useCurrentLocale()
  const paymentMethodsConfiguration = usePaymentMethodsConfiguration()

  // @TODO: translate
  const payButtonText = 'Connect credit card'

  const config = useMemo<CoreOptions>(
    () => ({
      environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT,
      clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
      analytics: { enabled: true },
      onPaymentCompleted: (data) => {
        datadogLogs.logger.info('Adyen Payment completed', { resultCode: data.resultCode })
      },
      onError: (error) => {
        datadogLogs.logger.error('Adyen Payment error', { ...error, shopSessionId })
      },
      locale: localeToAdyenLocale(locale),
      translations: {
        'no-NO': { payButton: payButtonText },
        'da-DK': { payButton: payButtonText },
        'en-US': { payButton: payButtonText },
      },
      paymentMethodsConfiguration,
    }),
    [locale, payButtonText, paymentMethodsConfiguration, shopSessionId],
  )

  return config
}

const localeToAdyenLocale = (locale: IsoLocale) => {
  switch (locale) {
    case Locale.DaDk:
    case Locale.NbNo:
      return locale
    default:
      return 'en-US'
  }
}

// openFirstStoredPaymentMethod: false,
// enableStoreDetails: true,
// returnUrl: PageLink.apiPaymentAdyenCallback({ locale: routingLocale, shopSessionId }),
