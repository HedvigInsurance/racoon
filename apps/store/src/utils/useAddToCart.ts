import { datadogLogs } from '@datadog/browser-logs'
import { useCallback } from 'react'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import {
  CartEntryAddMutation,
  useCartEntryAddMutation,
  ProductRecommendationsDocument,
  useCartEntryReplaceMutation,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useCartEntryToReplace } from '../components/ProductPage/ProductPage'

type Params = {
  shopSessionId: string
  onSuccess: (productOfferId: string) => void
}

export const useAddToCart = ({ shopSessionId, onSuccess }: Params) => {
  // ProductRecommendationsQuery needs to be an active query
  // before we can "re"fetch it after adding a new product into
  // the cart
  useProductRecommendations()

  const [addEntry, { loading }] = useCartEntryAdd({
    refetchQueries: [ProductRecommendationsDocument],
    awaitRefetchQueries: true,
  })

  const [replaceEntry, { loading: loadingReplace }] = useCartEntryReplaceMutation({
    refetchQueries: [ProductRecommendationsDocument],
    awaitRefetchQueries: true,
  })

  const entryToReplace = useCartEntryToReplace()
  const { showError } = useAppErrorHandleContext()

  const addToCart = useCallback(
    async (productOfferId: string) => {
      const options = {
        onCompleted() {
          onSuccess(productOfferId)
        },
        onError: showError,
      } as const

      if (entryToReplace) {
        await replaceEntry({
          variables: {
            shopSessionId,
            removeOfferId: entryToReplace.id,
            addOfferId: productOfferId,
          },
          ...options,
        })
      } else {
        await addEntry({
          variables: { shopSessionId, offerId: productOfferId },
          ...options,
        })
      }
    },
    [addEntry, entryToReplace, replaceEntry, shopSessionId, showError, onSuccess],
  )

  return [addToCart, loadingReplace || loading] as const
}

type CartEntryAddOptions = Parameters<typeof useCartEntryAddMutation>[0]

const useCartEntryAdd = (mutationOptions: CartEntryAddOptions = {}) => {
  const [mutate, mutationResult] = useCartEntryAddMutation(mutationOptions)
  const addCartEntry = useCallback(
    (options: CartEntryAddOptions = {}) => {
      const handleCompleted = (data: CartEntryAddMutation) => {
        const updatedShopSession = data.shopSessionCartEntriesAdd.shopSession
        if (!updatedShopSession) return

        const { variables } = options
        const addedOffer = updatedShopSession.cart.entries.find(
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
