import { datadogLogs } from '@datadog/browser-logs'
import {
  CartFragmentFragment,
  ProductRecommendationsDocument,
  ShopSessionDocument,
} from '@/services/apollo/generated'
import { useCartEntryRemoveMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useTracking } from '@/services/Tracking/useTracking'

type Params = {
  shopSessionId: string
  offerId: string
  onCompleted?: (cart: CartFragmentFragment) => void
}

export const useRemoveCartEntry = ({ shopSessionId, offerId, onCompleted }: Params) => {
  const { showError } = useAppErrorHandleContext()
  const tracking = useTracking()

  return useCartEntryRemoveMutation({
    variables: { shopSessionId, offerId },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      const updatedShopSession = data.shopSessionCartEntriesRemove.shopSession
      if (updatedShopSession) {
        const offer = updatedShopSession.cart.entries.find((entry) => entry.id == offerId)
        if (offer) {
          tracking.reportDeleteFromCart(offer)
        } else {
          datadogLogs.logger.error('Failed to find offer being removed in session cart', {
            shopSessionId,
            offerId,
          })
        }

        onCompleted?.(updatedShopSession.cart)
      }
    },
    onError: showError,
  })
}
