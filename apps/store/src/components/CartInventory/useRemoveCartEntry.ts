import { datadogLogs } from '@datadog/browser-logs'
import { useCallback } from 'react'
import { ProductRecommendationsDocument, ShopSessionDocument } from '@/services/apollo/generated'
import { useCartEntryRemoveMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'

export const useRemoveCartEntry = ({ cartId, offerId }: { cartId: string; offerId: string }) => {
  const { shopSession } = useShopSession()

  const tracking = useTracking()
  const [runMutation, mutationResult] = useCartEntryRemoveMutation({
    // Refetch recommendations
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
  })

  const { showApolloError } = useAppErrorHandleContext()

  const removeCartEntry = useCallback(() => {
    runMutation({
      variables: { cartId, offerId },
      onCompleted() {
        const offer = shopSession?.cart.entries.find((entry) => entry.id == offerId)
        if (offer) {
          tracking.reportDeleteFromCart(offer)
        } else {
          datadogLogs.logger.error('Failed to find offer being removed in session cart', {
            cartId,
            offerId,
          })
        }
      },
      onError: showApolloError,
    })
  }, [cartId, offerId, runMutation, shopSession, showApolloError, tracking])

  return [removeCartEntry, mutationResult] as const
}
