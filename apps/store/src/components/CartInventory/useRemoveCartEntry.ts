import { datadogLogs } from '@datadog/browser-logs'
import { useMemo } from 'react'
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
  offerId: string
  onCompleted?: (cart: CartFragmentFragment) => void
}

export const useRemoveCartEntry = ({ offerId, onCompleted }: Params) => {
  const { showError } = useAppErrorHandleContext()
  const { shopSession } = useShopSession()
  const tracking = useTracking()

  if (!shopSession) {
    throw new Error('Shop session should be available at this point.')
  }

  const offerToBeRemoved = useMemo(() => {
    return shopSession.cart.entries.find((offer) => offer.id === offerId)
  }, [shopSession.cart.entries, offerId])

  return useCartEntryRemoveMutation({
    variables: { shopSessionId: shopSession.id, offerId },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      if (offerToBeRemoved) {
        tracking.reportDeleteFromCart(offerToBeRemoved)
      } else {
        datadogLogs.logger.error('Failed to find offer being removed in session cart', {
          shopSessionId: shopSession.id,
          offerId,
        })
      }

      const updatedShopSession = data.shopSessionCartEntriesRemove.shopSession
      if (updatedShopSession) {
        onCompleted?.(updatedShopSession.cart)
      }
    },
    onError: showError,
  })
}
