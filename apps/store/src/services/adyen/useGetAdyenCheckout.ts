import AdyenCheckoutAPI from '@adyen/adyen-web'
import { type UIElement } from '@adyen/adyen-web/dist/types/components/UIElement'
import { type CoreOptions } from '@adyen/adyen-web/dist/types/core/types'
import { type PaymentAction } from '@adyen/adyen-web/dist/types/types'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useCallback } from 'react'
import { theme } from 'ui'
import { BrowserInfo } from '@/services/graphql/generated'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useAdyenTranslations } from './useAdyenTranslations'
import { useTokenizePaymentDetails } from './useTokenizePaymentDetails'

export const useGetAdyenCheckout = (): ((options: CoreOptions) => AdyenCheckoutAPI) => {
  const { countryCode, currencyCode } = useCurrentCountry()
  const { payButton, locale } = useAdyenTranslations()
  const handleSubmit = useHandleSubmit()

  return useCallback(
    (options) => {
      return new AdyenCheckoutAPI({
        locale,
        environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT,
        clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
        analytics: { enabled: true },
        onSubmit: handleSubmit,
        translations: { [locale]: { payButton } },
        allowPaymentMethods: [
          // Credit Cards
          'scheme',
          'applepay',
        ],

        paymentMethodsConfiguration: getPaymentMethodsConfiguration(currencyCode, countryCode),
        ...options,
      })
    },
    [countryCode, currencyCode, locale, payButton, handleSubmit],
  )
}

const getPaymentMethodsConfiguration = (currency: string, countryCode: string) => {
  return {
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
        currency,
      },
      buttonType: 'subscribe',
      countryCode,
    },
  } as const
}

type AdyenState = {
  data: {
    browserInfo: BrowserInfo
    paymentMethod: string
  }
}

const useHandleSubmit = () => {
  const tokenizePaymentDetails = useTokenizePaymentDetails()

  return useCallback(
    async (state: AdyenState, element: UIElement) => {
      datadogRum.addAction('PaymentConnectLegacy Submit')

      let data: Awaited<ReturnType<typeof tokenizePaymentDetails>>
      try {
        data = await tokenizePaymentDetails(state.data.browserInfo, state.data.paymentMethod)
      } catch (error) {
        datadogLogs.logger.warn('Adyen Submit | Error submitting payment details', {
          error,
        })
        element.setStatus('error')
        return
      }

      if (data.__typename === 'TokenizationResponseAction') {
        datadogLogs.logger.info('Adyen Submit | Action')
        const action = JSON.parse(data.action) as PaymentAction
        element.handleAction(action)
      } else if (['Authorised', 'Pending'].includes(data.resultCode)) {
        datadogLogs.logger.info('Adyen Submit | Finished')
        element.setStatus('success')
      } else {
        datadogLogs.logger.warn('Adyen Submit | Failed', { resultCode: data.resultCode })
        element.setStatus('error')
        window.setTimeout(() => element.setStatus('ready'), 1000)
      }
    },
    [tokenizePaymentDetails],
  )
}
