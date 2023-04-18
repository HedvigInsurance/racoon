import AdyenCheckoutAPI from '@adyen/adyen-web'
import { PaymentMethodsResponseObject } from '@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse/types'
import { useEffect, useMemo, useRef } from 'react'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import '@adyen/adyen-web/dist/adyen.css'
import { PageLink } from '@/utils/PageLink'
import { localeToAdyenLocale, usePaymentMethodConfiguration } from './Adyen.helpers'
import { AdyenDropinStyles } from './DropinStyles'

type Props = {
  shopSessionId: string
  paymentMethodsResponse: PaymentMethodsResponseObject
  onSuccess: (paymentConnection: unknown) => void
}

export const AdyenCheckout = ({ shopSessionId, onSuccess, paymentMethodsResponse }: Props) => {
  const paymentContainer = useRef<HTMLDivElement>(null)
  const configuration = useAdyenConfiguration({ shopSessionId })

  useEffect(() => {
    const createCheckout = async () => {
      const checkout = await AdyenCheckoutAPI({
        ...configuration,
        paymentMethodsResponse,
        onSubmit: (_state: any, dropinComponent: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          dropinComponent.setStatus('loading')
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            dropinComponent.setStatus('success', { message: 'Connected!' })
            onSuccess({ success: true })
          }, 1000)
        },
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
  }, [paymentMethodsResponse, configuration, onSuccess])

  return (
    <AdyenDropinStyles>
      <div ref={paymentContainer} />
    </AdyenDropinStyles>
  )
}

type AdyenConfigurationParams = { shopSessionId: string }

const useAdyenConfiguration = ({ shopSessionId }: AdyenConfigurationParams) => {
  const { locale, routingLocale } = useCurrentLocale()
  const paymentMethodConfiguration = usePaymentMethodConfiguration()

  // @TODO: translate
  const payButtonText = 'Connect credit card'

  return useMemo(
    () => ({
      environment: process.env.NEXT_PUBLIC_ADYEN_ENVIRONMENT,
      clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
      analytics: { enabled: true },
      onPaymentCompleted: (result: any, component: any) => {
        console.info('Payment completed', result, component)
      },
      onError: (error: any, component: any) => {
        console.error(error.name, error.message, error.stack, component)
      },
      openFirstStoredPaymentMethod: false,
      enableStoreDetails: true,

      locale: localeToAdyenLocale(locale),
      translations: {
        'no-NO': { payButton: payButtonText },
        'da-DK': { payButton: payButtonText },
        'en-US': { payButton: payButtonText },
      },
      returnUrl: PageLink.apiPaymentAdyenCallback({ locale: routingLocale, shopSessionId }),

      paymentMethodConfiguration,
    }),
    [locale, routingLocale, payButtonText, paymentMethodConfiguration, shopSessionId],
  )
}
