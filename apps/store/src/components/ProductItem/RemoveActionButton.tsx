import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { Button, Dialog, Text } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { useAppErrorHandleContext } from '@/services/appErrors/AppErrorContext'
import {
  type CartFragmentFragment,
  ProductRecommendationsDocument,
  ShopSessionDocument,
  useCartEntryRemoveMutation,
  type ProductOfferFragment,
} from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { ActionButton } from './ProductItem'

type Props = {
  shopSessionId: string
  offer: ProductOfferFragment
  title: string
  onCompleted?: (cart: CartFragmentFragment) => void
}

export const RemoveActionButton = (props: Props) => {
  const { t } = useTranslation('cart')

  const { showError } = useAppErrorHandleContext()
  const tracking = useTracking()
  const [removeProductOffer, result] = useCartEntryRemoveMutation({
    variables: { shopSessionId: props.shopSessionId, offerId: props.offer.id },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      const updatedShopSession = data.shopSessionCartEntriesRemove.shopSession
      if (updatedShopSession) {
        props.onCompleted?.(updatedShopSession.cart)
      }
    },
    onError: (error) => {
      datadogLogs.logger.error('Failed to remove offer from cart', {
        shopSessionId: props.shopSessionId,
        offerId: props.offer.id,
        error,
      })
      showError(error)
    },
  })

  const handleClickRemove = () => {
    tracking.reportDeleteFromCart(props.offer)
    removeProductOffer()
  }

  return (
    <FullscreenDialog.Root>
      <Dialog.Trigger asChild={true}>
        <ActionButton>{t('REMOVE_ENTRY_BUTTON')}</ActionButton>
      </Dialog.Trigger>

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleClickRemove} loading={result.loading}>
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
