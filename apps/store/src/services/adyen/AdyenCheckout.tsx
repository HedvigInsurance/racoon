import { type CoreOptions } from '@adyen/adyen-web/dist/types/core/types'
import { useEffect, useRef } from 'react'
import '@adyen/adyen-web/dist/adyen.css'
import { AdyenDropinStyles } from './DropinStyles'
import { useGetAdyenCheckout } from './useGetAdyenCheckout'

type Props = {
  paymentMethodsResponse: Required<CoreOptions>['paymentMethodsResponse']
}

const AdyenCheckout = ({ paymentMethodsResponse }: Props) => {
  const paymentContainer = useRef<HTMLDivElement>(null)
  const getAdyenCheckout = useGetAdyenCheckout()

  useEffect(() => {
    if (!paymentContainer.current) return

    const element = getAdyenCheckout({ paymentMethodsResponse })
      .create('dropin')
      .mount(paymentContainer.current)

    return () => {
      element.unmount()
    }
  }, [getAdyenCheckout, paymentMethodsResponse])

  return (
    <AdyenDropinStyles>
      <div ref={paymentContainer} />
    </AdyenDropinStyles>
  )
}

export default AdyenCheckout
