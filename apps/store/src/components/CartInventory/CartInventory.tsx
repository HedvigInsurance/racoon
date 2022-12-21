import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { Heading, Space } from 'ui'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  cart: CartFragmentFragment
  children: (offer: ProductOfferFragment) => ReactNode
}

export const CartInventory = ({ cart, children }: Props) => {
  const formatter = useFormatter()

  return (
    <Space y={1}>
      <List>
        {cart.entries.map((offer) => (
          <li key={offer.id}>{children(offer)}</li>
        ))}
      </List>
      <Footer>
        <TotalWrapper>
          <Heading as="h3" variant="standard.18">
            Total
          </Heading>
          <PriceWrapper>
            <OriginalPrice as="h3" variant="standard.18">
              {formatter.monthlyPrice(cart.cost.net)}
            </OriginalPrice>
            <Heading as="h3" variant="standard.18">
              {formatter.monthlyPrice(cart.cost.discount)}
            </Heading>
          </PriceWrapper>
        </TotalWrapper>
        <DiscountMessage>
          in {cart.redeemedCampaigns[0].discount.months} months, then{' '}
          {formatter.monthlyPrice(cart.cost.net)}
        </DiscountMessage>
      </Footer>
    </Space>
  )
}

const List = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[4],
}))

const Footer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

const TotalWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const PriceWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space[2],
}))

const OriginalPrice = styled(Heading)(({ theme }) => ({
  color: theme.colors.textSecondary,
  textDecoration: 'line-through',
}))

const DiscountMessage = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  color: theme.colors.textSecondary,
}))
