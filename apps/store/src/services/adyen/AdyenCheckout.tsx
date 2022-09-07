import AdyenCheckoutAPI from '@adyen/adyen-web'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useRef } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import '@adyen/adyen-web/dist/adyen.css'
import { PageLink } from '@/lib/PageLink'
import { localeToAdyenLocale, usePaymentMethodConfiguration } from './Adyen.helpers'
import { AdyenDropinStyles } from './DropinStyles'

type Props = {
  paymentMethodsResponse: object
  onSuccess: (paymentConnection: unknown) => void
}

export const AdyenCheckout = ({ onSuccess, paymentMethodsResponse }: Props) => {
  const paymentContainer = useRef<HTMLDivElement>(null)
  const configuration = useAdyenConfiguration()

  useEffect(() => {
    const createCheckout = async () => {
      const checkout = await AdyenCheckoutAPI({
        ...configuration,
        paymentMethodsResponse,
        onSubmit: (_state: any, dropinComponent: any) => {
          dropinComponent.setStatus('loading')
          setTimeout(() => {
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

const useAdyenConfiguration = () => {
  const { locale } = useCurrentLocale()
  const { t } = useTranslation()
  const paymentMethodConfiguration = usePaymentMethodConfiguration()

  const payButtonText = t('CHECKOUT_BUTTON_CONNECT_CARD')

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
      returnUrl: PageLink.apiPaymentAdyenCallback({ locale }),

      paymentMethodConfiguration,
    }),
    [locale, payButtonText, paymentMethodConfiguration],
  )
}
