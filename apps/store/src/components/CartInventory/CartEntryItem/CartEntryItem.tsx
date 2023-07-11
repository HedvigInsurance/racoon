import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Dialog, theme } from 'ui'
import { CartItem } from '@/components/CartItem/CartItem'
import { useEditProductOffer } from '@/components/CartPage/useEditProductOffer'
import { type CartFragmentFragment } from '@/services/apollo/generated'
import { CartEntry } from '../CartInventory.types'
import { RemoveEntryDialog } from '../RemoveEntryDialog'
import { EditEntryButton } from './EditEntryButton'

type Props = CartEntry & {
  shopSessionId: string
  defaultOpen?: boolean
  readOnly?: boolean
  onRemove?: (cart: CartFragmentFragment) => void
}

export const CartEntryItem = ({
  shopSessionId,
  readOnly,
  onRemove,
  defaultOpen = false,
  ...cartEntry
}: Props) => {
  const { t } = useTranslation('cart')

  const [editProductOffer, editState] = useEditProductOffer()
  const handleConfirmEdit = () => {
    editProductOffer({
      shopSessionId,
      offerId: cartEntry.offerId,
      productName: cartEntry.productName,
      data: cartEntry.data,
    })
  }

  return (
    <CartItem
      {...cartEntry}
      displayName={cartEntry.title}
      startDate={cartEntry.startDate ?? undefined}
      defaultExpanded={defaultOpen}
    >
      {!readOnly && (
        <ActionsRow>
          <EditEntryButton onConfirm={handleConfirmEdit} loading={editState === 'loading'} />

          <RemoveEntryDialog shopSessionId={shopSessionId} onCompleted={onRemove} {...cartEntry}>
            <Dialog.Trigger asChild={true}>
              <Button variant="secondary-alt" size="medium">
                {t('REMOVE_ENTRY_BUTTON')}
              </Button>
            </Dialog.Trigger>
          </RemoveEntryDialog>
        </ActionsRow>
      )}
    </CartItem>
  )
}

const ActionsRow = styled.div({
  display: 'grid',
  gap: theme.space.sm,
  gridTemplateColumns: '1fr 1fr',
})
