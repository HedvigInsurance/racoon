import styled from '@emotion/styled'
import { Heading, Space } from 'ui'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { OfferInventoryItem } from './OfferInventoryItem'

type Props = {
  cart: CartFragmentFragment
  onRemove?: (offer: ProductOfferFragment) => void
}

export const CartInventory = ({ cart, onRemove }: Props) => {
  const currencyFormatter = useCurrencyFormatter(cart.cost.total.currencyCode)

  return (
    <Space y={1}>
      <List>
        {cart.entries.map((offer) => (
          <li key={offer.id}>
            <OfferInventoryItem offer={offer} onRemove={onRemove} />
          </li>
        ))}
      </List>
      <Footer>
        <Heading as="h3" variant="standard.18">
          Total
        </Heading>
        <Heading as="h3" variant="standard.18">
          {currencyFormatter.format(cart.cost.total.amount)}/mån
        </Heading>
      </Footer>
    </Space>
  )
}

const List = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[4],
  backgroundColor: theme.colors.gray100,
}))

const Footer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})
