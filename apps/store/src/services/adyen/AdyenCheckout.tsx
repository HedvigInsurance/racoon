import AdyenCheckoutAPI from '@adyen/adyen-web'
import PaymentMethodsResponse from '@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse'
import { useEffect, useRef } from 'react'
import '@adyen/adyen-web/dist/adyen.css'
import { AdyenDropinStyles } from './DropinStyles'
import { useAdyenConfiguration } from './useAdyenConfiguration'

type Props = {
  shopSessionId: string
  paymentMethodsResponse: PaymentMethodsResponse
  onSuccess: (paymentConnection: unknown) => void
}

export const AdyenCheckout = ({ shopSessionId, onSuccess, paymentMethodsResponse }: Props) => {
  const paymentContainer = useRef<HTMLDivElement>(null)
  const configuration = useAdyenConfiguration(shopSessionId)

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
