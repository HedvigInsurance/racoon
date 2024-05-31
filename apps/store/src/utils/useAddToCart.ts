import { datadogLogs } from '@datadog/browser-logs'
import { useCallback } from 'react'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import type { CartEntryAddMutation } from '@/services/graphql/generated'
import {
  useCartEntryAddMutation,
  ProductRecommendationsDocument,
  useCartEntryReplaceMutation,
} from '@/services/graphql/generated'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'

type Params = {
  shopSessionId: string
  onSuccess: (productOfferId: string, data: ShopSession['cart']) => void
  onError?: (error: Error) => void
  entryToReplace?: string
}

export const useAddToCart = (params: Params) => {
  const options = {
    refetchQueries: [ProductRecommendationsDocument],
    awaitRefetchQueries: true,
  }

  const [addEntry, { loading }] = useCartEntryAddMutation(options)
  const [replaceEntry, { loading: loadingReplace }] = useCartEntryReplaceMutation(options)

  const { showError } = useAppErrorHandleContext()
  const addToCart = useCallback(
    async (productOfferId: string) => {
      const handleCompleted = (data: CartEntryAddMutation) => {
        const updatedShopSession = data.shopSessionCartEntriesAdd.shopSession
        if (!updatedShopSession) return

        const addedOffer = updatedShopSession.cart.entries.find(
          (entry) => entry.id === productOfferId,
        )

        if (!addedOffer) {
          datadogLogs.logger.error('Added offer missing in cart, this should not happen', {
            shopSessionId: params.shopSessionId,
            productOfferId,
          })
        }

        params.onSuccess(productOfferId, updatedShopSession.cart)
      }

      const handleError = (error: Error) => {
        params.onError?.(error)
        showError(error)
      }

      if (params.entryToReplace) {
        await replaceEntry({
          variables: {
            shopSessionId: params.shopSessionId,
            addOfferId: productOfferId,
            removeOfferId: params.entryToReplace,
          },
          onCompleted: handleCompleted,
          onError: handleError,
        })
      } else {
        await addEntry({
          variables: {
            shopSessionId: params.shopSessionId,
            offerId: productOfferId,
          },
          onCompleted: handleCompleted,
          onError: handleError,
        })
      }
    },
    [addEntry, replaceEntry, showError, params],
  )

  return [addToCart, loadingReplace || loading] as const
}
