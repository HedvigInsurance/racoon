import { datadogLogs } from '@datadog/browser-logs'
import { SyntheticEvent, useCallback } from 'react'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import {
  CartEntryAddMutation,
  useCartEntryAddMutation,
  ProductRecommendationsDocument,
  useCartEntryRemoveMutation,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { getOrThrowFormValue } from '@/utils/getOrThrowFormValue'
import { useCartEntryToReplace } from '../ProductPage'
import { FormElement } from './PurchaseForm.constants'

type Params = {
  cartId: string
  priceIntentId: string
  onSuccess: (productOfferId: string, nextUrl?: string) => void
}

export const useHandleSubmitAddToCart = ({ cartId, onSuccess }: Params) => {
  // ProductRecommendationsQuery needs to be an active query
  // before we can "re"fetch it after adding a new product into
  // the cart
  useProductRecommendations()

  const [addEntry, { loading }] = useCartEntryAdd({
    refetchQueries: [ProductRecommendationsDocument],
    awaitRefetchQueries: true,
  })

  const [removeEntry, { loading: loadingRemove }] = useCartEntryRemoveMutation()

  const entryToReplace = useCartEntryToReplace()
  const { showError } = useAppErrorHandleContext()
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const productOfferId = getOrThrowFormValue(formData, FormElement.ProductOfferId)
    const nextUrl = event.nativeEvent.submitter?.getAttribute('value') ?? undefined

    if (entryToReplace) {
      await removeEntry({ variables: { cartId, offerId: entryToReplace.id } })
    }

    await addEntry({
      variables: { cartId, offerId: productOfferId },
      onCompleted() {
        onSuccess(productOfferId, nextUrl)
      },
      onError: showError,
    })
  }

  return [handleSubmit, loadingRemove || loading] as const
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
