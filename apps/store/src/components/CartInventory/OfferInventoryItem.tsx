import styled from '@emotion/styled'
import { Pillow } from '@/components/Pillow/Pillow'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import * as InventoryItem from './InventoryItem'

type Props = {
  offer: ProductOfferFragment
  onRemove?: (offer: ProductOfferFragment) => void
}

export const OfferInventoryItem = ({ offer, onRemove }: Props) => {
  const formatter = useFormatter()

  return (
    <InventoryItem.Root>
      <InventoryItem.Left>
        <Pillow size="small" />
      </InventoryItem.Left>
      <InventoryItem.Main>
        <InventoryItem.MainLeft>
          <p>{offer.variant.displayName}</p>
        </InventoryItem.MainLeft>
        <InventoryItem.MainRight>{formatter.monthlyPrice(offer.price)}</InventoryItem.MainRight>
        {onRemove && (
          <InventoryItem.MainBottom>
            <ButtonLink onClick={() => onRemove(offer)}>Ta bort</ButtonLink>
          </InventoryItem.MainBottom>
        )}
      </InventoryItem.Main>
    </InventoryItem.Root>
  )
}

const ButtonLink = styled.button(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  textDecoration: 'underline',
  cursor: 'pointer',
}))
