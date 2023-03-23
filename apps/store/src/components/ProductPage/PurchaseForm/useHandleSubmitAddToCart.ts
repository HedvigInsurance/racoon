import { datadogLogs } from '@datadog/browser-logs'
import { SyntheticEvent, useCallback } from 'react'
import { CartEntryAddMutation, useCartEntryAddMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { FormElement } from './PurchaseForm.constants'

type Params = {
  cartId: string
  priceIntentId: string
  onSuccess: (productOfferId: string, nextUrl?: string) => void
}

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  const [addEntry, { loading }] = useCartEntryAdd({
    // Refetch recommendations
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  })

  const { showApolloError } = useAppErrorHandleContext()
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)
    const nextUrl = event.nativeEvent.submitter?.getAttribute('value') ?? undefined

    addEntry({
      variables: { cartId, offerId: productOfferId },
      onCompleted() {
        onSuccess(productOfferId, nextUrl)
      },
      onError: showApolloError,
    })
  }

  return [handleSubmit, loading] as const
}

type CartEntryAddOptions = Parameters<typeof useCartEntryAddMutation>[0]

const useCartEntryAdd = (mutationOptions: CartEntryAddOptions = {}) => {
  const [mutate, mutationResult] = useCartEntryAddMutation(mutationOptions)
  const addCartEntry = useCallback(
    (options: CartEntryAddOptions = {}) => {
      const handleCompleted = (data: CartEntryAddMutation) => {
        if (!data.cartEntriesAdd.cart) return

        const { variables } = options
        const addedOffer = data.cartEntriesAdd.cart.entries.find(
          (entry) => entry.id === variables?.offerId,
        )
        if (!addedOffer) {
          datadogLogs.logger.error('Added offer missing in cart, this should not happen', {
            ...variables,
          })
        }

        options.onCompleted?.(data)
      }

      return mutate({ ...options, onCompleted: handleCompleted })
    },
    [mutate],
  )
  return [addCartEntry, mutationResult] as const
}
