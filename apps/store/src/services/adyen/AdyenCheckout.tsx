import AdyenCheckoutAPI from '@adyen/adyen-web'
import { useTheme } from '@emotion/react'
import { useEffect, useMemo, useRef } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import '@adyen/adyen-web/dist/adyen.css'

export const AdyenCheckout = () => {
  const { locale } = useCurrentLocale()
  const paymentContainer = useRef<HTMLDivElement>(null)
  const paymentMethodConfiguration = useAdyenPaymentMethodConfiguration()

  useEffect(() => {
    const createCheckout = async () => {
      const checkout = await AdyenCheckoutAPI({
        ...configuration,
        paymentMethodConfiguration,
        locale,
      })

      if (paymentContainer.current) {
        try {
          checkout.create('dropin').mount(paymentContainer.current)
        } catch (error) {
          console.error('Error mounting Adyen Checkout', error)
        }
      }
    }

    createCheckout()
  }, [locale, paymentMethodConfiguration])

  return <div ref={paymentContainer} />
}

const configuration = {
  environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT,
  clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
  analytics: { enabled: true },
  onPaymentCompleted: (result: any, component: any) => {
    console.info('Payment completed', result, component)
  },
  onError: (error: any, component: any) => {
    console.error(error.name, error.message, error.stack, component)
  },
  paymentMethodsResponse: {
    paymentMethods: [
      {
        brands: ['visadankort', 'mc', 'visa'],
        details: [
          {
            key: 'encryptedCardNumber',
            type: 'cardToken',
          },
          {
            key: 'encryptedSecurityCode',
            type: 'cardToken',
          },
          {
            key: 'encryptedExpiryMonth',
            type: 'cardToken',
          },
          {
            key: 'encryptedExpiryYear',
            type: 'cardToken',
          },
          {
            key: 'holderName',
            optional: true,
            type: 'text',
          },
        ],
        name: 'Credit Card',
        type: 'scheme',
      },
      {
        configuration: {
          merchantId: '50',
          gatewayMerchantId: 'HEDVIG-DK',
        },
        details: [
          {
            key: 'paywithgoogle.token',
            type: 'payWithGoogleToken',
          },
        ],
        name: 'Google Pay',
        type: 'paywithgoogle',
      },
    ],
  },
  openFirstStoredPaymentMethod: false,
  enableStoreDetails: true,
}

const useAdyenPaymentMethodConfiguration = () => {
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
    }),
    [theme],
  )
}
