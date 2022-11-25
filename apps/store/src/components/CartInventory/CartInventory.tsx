import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode } from 'react'
import { Heading, Space } from 'ui'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

type Props = {
  cart: CartFragmentFragment
  children: (offer: ProductOfferFragment) => ReactNode
}

export const CartInventory = ({ cart, children }: Props) => {
  const { t } = useTranslation()
  const currencyFormatter = useCurrencyFormatter(cart.cost.gross.currencyCode)

  return (
    <Space y={1}>
      <List>
        {cart.entries.map((offer) => (
          <li key={offer.id}>{children(offer)}</li>
        ))}
      </List>
      <Footer>
        <Heading as="h3" variant="standard.18">
          Total
        </Heading>
        <Heading as="h3" variant="standard.18">
          {t('MONTHLY_PRICE', { displayAmount: currencyFormatter.format(cart.cost.net.amount) })}
        </Heading>
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
  justifyContent: 'space-between',
})
