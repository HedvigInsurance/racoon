import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import { useCartEntryAddMutation } from '@/services/apollo/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './PurchaseForm.constants'

type Params = {
  cartId: string
  priceIntentId: string
  onSuccess: (productOfferId: string) => void
}

// Temporary implementation, we should set startDate on priceIntent before adding to cart
export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAddMutation()
  const tracking = useTracking()

  // @TODO: expose and handle errors
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)

    addEntry({
      variables: { cartId, offerId: productOfferId },
      onCompleted(data) {
        // TODO: Handle userError
        if (!data.cartEntriesAdd.cart) return

        const addedOffer = data.cartEntriesAdd.cart.entries.find(
          (entry) => entry.id === productOfferId,
        )
        if (addedOffer) {
          tracking.reportAddToCart(addedOffer)
        } else {
          datadogLogs.logger.warn('Added offer missing in cart, this should not happen', {
            cartId,
            productOfferId,
          })
        }

        onSuccess(productOfferId)
      },
    })
  }

  return [handleSubmit, loading] as const
}
