import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import {
  type CartFragmentFragment,
  ProductRecommendationsDocument,
  ShopSessionDocument,
  useCartEntryRemoveMutation,
} from '@/services/apollo/generated'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { ActionButton } from './ProductItem'

type Props = {
  shopSessionId: string
  offerId: string
  title: string
  onCompleted?: (cart: CartFragmentFragment) => void
}

export const RemoveActionButton = (props: Props) => {
  const { t } = useTranslation('cart')

  const { showError } = useAppErrorHandleContext()
  const tracking = useTracking()
  const [removeProductOffer, result] = useCartEntryRemoveMutation({
    variables: { shopSessionId: props.shopSessionId, offerId: props.offerId },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      const updatedShopSession = data.shopSessionCartEntriesRemove.shopSession
      if (updatedShopSession) {
        const offer = updatedShopSession.cart.entries.find((item) => item.id == props.offerId)
        if (offer) {
          tracking.reportDeleteFromCart(offer)
          props.onCompleted?.(updatedShopSession.cart)
        } else {
          datadogLogs.logger.error('Failed to find offer being removed in session cart', {
            shopSessionId: props.shopSessionId,
            offerId: props.offerId,
          })
        }
      }
    },
    onError: showError,
  })

  return (
    <FullscreenDialog.Root>
      <Dialog.Trigger asChild={true}>
        <ActionButton>{t('REMOVE_ENTRY_BUTTON')}</ActionButton>
      </Dialog.Trigger>

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={() => removeProductOffer()} loading={result.loading}>
              {t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost">
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <Text size={{ _: 'md', lg: 'xl' }} align="center">
          {t('REMOVE_ENTRY_MODAL_PROMPT', { name: props.title })}
        </Text>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
