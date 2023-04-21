import { datadogLogs } from '@datadog/browser-logs'
import {
  CartFragmentFragment,
  ProductRecommendationsDocument,
  ShopSessionDocument,
} from '@/services/apollo/generated'
import { useCartEntryRemoveMutation } from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'

type Params = {
  cartId: string
  offerId: string
  onCompleted?: (cart: CartFragmentFragment) => void
}

export const useRemoveCartEntry = ({ cartId, offerId, onCompleted }: Params) => {
  const { shopSession } = useShopSession()
  const { showError } = useAppErrorHandleContext()
  const tracking = useTracking()

  return useCartEntryRemoveMutation({
    variables: { cartId, offerId },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      if (data.cartEntriesRemove.cart) {
        const offer = shopSession?.cart.entries.find((entry) => entry.id == offerId)
        if (offer) {
          tracking.reportDeleteFromCart(offer)
        } else {
          datadogLogs.logger.error('Failed to find offer being removed in session cart', {
            cartId,
            offerId,
          })
        }

        onCompleted?.(data.cartEntriesRemove.cart)
      }
    },
    onError: showError,
  })
}
