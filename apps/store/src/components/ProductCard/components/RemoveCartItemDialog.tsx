import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { FullscreenDialog } from 'ui/src/components/Dialog/FullscreenDialog'
import { Button, Text, Tooltip } from 'ui'
import { useShowAppError } from '@/services/appErrors/appErrorAtom'
import {
  type CartFragment,
  type ProductOfferFragment,
  ProductRecommendationsDocument,
  ShopSessionDocument,
  useCartEntryRemoveMutation,
} from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'

type RootProps = ComponentProps<typeof FullscreenDialog.Root> & {
  shopSessionId: string
  offer: ProductOfferFragment
  onCompleted?: (cart: CartFragment) => void
}

const RemoveCartItemDialogRoot = ({
  children,
  shopSessionId,
  offer,
  onCompleted,
  ...props
}: RootProps) => {
  const { t } = useTranslation('cart')

  const showError = useShowAppError()
  const tracking = useTracking()
  const [removeProductOffer, result] = useCartEntryRemoveMutation({
    variables: { shopSessionId: shopSessionId, offerId: offer.id },
    refetchQueries: [ShopSessionDocument, ProductRecommendationsDocument],
    awaitRefetchQueries: true,
    onCompleted(data) {
      const updatedShopSession = data.shopSessionCartEntriesRemove.shopSession
      if (updatedShopSession) {
        onCompleted?.(updatedShopSession.cart)
      }
    },
    onError: (error) => {
      datadogLogs.logger.error('Failed to remove offer from cart', {
        shopSessionId: shopSessionId,
        offerId: offer.id,
        error,
      })
      showError(error)
    },
  })

  const handleClickRemove = () => {
    tracking.reportDeleteFromCart(offer)
    removeProductOffer()
  }

  return (
    <FullscreenDialog.Root {...props}>
      <Tooltip.Root>{children}</Tooltip.Root>

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <>
            <Button onClick={handleClickRemove} loading={result.loading} fullWidth={true}>
              {t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost" fullWidth={true}>
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullscreenDialog.Close>
          </>
        }
      >
        <FullscreenDialog.Title asChild={true}>
          <Text size={{ _: 'md', lg: 'xl' }} align="center">
            {t('REMOVE_ENTRY_MODAL_PROMPT', { name: offer.product.displayNameFull })}
          </Text>
        </FullscreenDialog.Title>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

type TriggerProps = ComponentProps<typeof FullscreenDialog.Trigger>
const RemoveCartItemDialogTrigger = ({ children, ...props }: TriggerProps) => {
  const { t } = useTranslation('cart')

  return (
    <>
      <Tooltip.Trigger asChild>
        <FullscreenDialog.Trigger asChild {...props} aria-label={t('REMOVE_ENTRY_BUTTON')}>
          {children}
        </FullscreenDialog.Trigger>
      </Tooltip.Trigger>

      <Tooltip.Content sideOffset={5}>{t('REMOVE_ENTRY_BUTTON')}</Tooltip.Content>
    </>
  )
}

export const RemoveCartItemDialog = {
  Root: RemoveCartItemDialogRoot,
  Trigger: RemoveCartItemDialogTrigger,
}
