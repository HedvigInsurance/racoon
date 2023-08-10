import { useTranslation } from 'next-i18next'
import { Dialog } from 'ui'
import { useEditProductOffer } from '@/components/CartPage/useEditProductOffer'
import { ActionButton, ProductItem } from '@/components/ProductItem/ProductItem'
import { type CartFragmentFragment } from '@/services/apollo/generated'
import { CartEntry } from '../CartInventory.types'
import { RemoveEntryDialog } from '../RemoveEntryDialog'
import { EditEntryButton } from './EditEntryButton'
import { useProductItemProps } from './useProductItemProps'

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

  const productItemProps = useProductItemProps(cartEntry)
  return (
    <ProductItem {...productItemProps} defaultExpanded={defaultOpen}>
      {!readOnly && (
        <>
          <EditEntryButton onConfirm={handleConfirmEdit} loading={editState === 'loading'} />

          <RemoveEntryDialog shopSessionId={shopSessionId} onCompleted={onRemove} {...cartEntry}>
            <Dialog.Trigger asChild={true}>
              <ActionButton>{t('REMOVE_ENTRY_BUTTON')}</ActionButton>
            </Dialog.Trigger>
          </RemoveEntryDialog>
        </>
      )}
    </ProductItem>
  )
}
