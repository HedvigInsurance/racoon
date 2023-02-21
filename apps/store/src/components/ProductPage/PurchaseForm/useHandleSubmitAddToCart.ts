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

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAdd({
    // Refetch recommendations
    refetchQueries: 'active',
  })
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

const useCartEntryAdd = (mutationOptions: CartEntryAddOptions = {}) => {
  const tracking = useTracking()
  const [mutate, mutationResult] = useCartEntryAddMutation(mutationOptions)
  const addCartEntry = useCallback(
    (options: CartEntryAddOptions = {}) => {
      const handleCompleted = (data: CartEntryAddMutation) => {
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
      }

      return mutate({ ...options, onCompleted: handleCompleted })
    },
    [mutate, tracking],
  )
  return [addCartEntry, mutationResult] as const
}
