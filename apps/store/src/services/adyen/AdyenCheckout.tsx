import AdyenCheckoutAPI from '@adyen/adyen-web'
import { useTheme } from '@emotion/react'
import { useEffect, useMemo, useRef } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import '@adyen/adyen-web/dist/adyen.css'
import { PageLink } from '@/lib/PageLink'

type Props = {
  paymentMethods: object
  onSuccess: (paymentConnection: unknown) => void
}

export const AdyenCheckout = ({ onSuccess, paymentMethods }: Props) => {
  const paymentContainer = useRef<HTMLDivElement>(null)
  const configuration = useAdyenConfiguration()

  useEffect(() => {
    const createCheckout = async () => {
      const checkout = await AdyenCheckoutAPI({
        ...configuration,
        paymentMethodsResponse: paymentMethods,
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
  }, [paymentMethods, configuration, onSuccess])

  return <div ref={paymentContainer} />
}

const useAdyenConfiguration = () => {
  const { locale } = useCurrentLocale()
  const theme = useTheme()

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
      locale,
      returnUrl: PageLink.apiPaymentAdyenCallback({ locale }),

      paymentMethodConfiguration: {
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
      },
    }),
    [theme, locale],
  )
}
