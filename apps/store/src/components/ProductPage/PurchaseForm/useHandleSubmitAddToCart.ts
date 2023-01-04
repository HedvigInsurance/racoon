import { BaseMutationOptions } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler, useCallback } from 'react'
import { CartEntryAddMutation, useCartEntryAddMutation } from '@/services/apollo/generated'
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
  const [addEntry, { loading }] = useCartEntryAdd()
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)

    // @TODO: expose and handle errors
    addEntry({
      variables: { cartId, offerId: productOfferId },
      onCompleted() {
        onSuccess(productOfferId)
      },
    })
  }

  return [handleSubmit, loading] as const
}

type CartEntryAddOptions = Parameters<typeof useCartEntryAddMutation>[0]
type CartEntryAddOnCompletedOptions = BaseMutationOptions<CartEntryAddMutation>

const useCartEntryAdd = (mutationOptions: CartEntryAddOptions = {}) => {
  const tracking = useTracking()

  const handleCompleted = useCallback(
    (data: CartEntryAddMutation, options: CartEntryAddOnCompletedOptions = {}) => {
      if (!data.cartEntriesAdd.cart) return

      const { variables } = options

      const addedOffer = data.cartEntriesAdd.cart.entries.find(
        (entry) => entry.id === variables?.offerId,
      )
      if (addedOffer) {
        tracking.reportAddToCart(addedOffer)
      } else {
        datadogLogs.logger.error('Added offer missing in cart, this should not happen', {
          ...variables,
        })
      }

      options.onCompleted?.(data)
    },
    [tracking],
  )
  return useCartEntryAddMutation({ ...mutationOptions, onCompleted: handleCompleted })
}
