import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode } from 'react'
import { Heading, Space, Text } from 'ui'
import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { useGetDiscountDurationExplanation } from './CartInventory.helpers'

type Props = {
  cart: CartFragmentFragment
  children: (offer: ProductOfferFragment) => ReactNode
}

export const CartInventory = ({ cart, children }: Props) => {
  const { t } = useTranslation('cart')
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()
  const campaigns = cart.redeemedCampaigns.map((item) => ({
    discount: item.discount,
  }))
  const hasDiscount = cart.redeemedCampaigns.length !== 0

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
            {t('CHECKOUT_PRICE_TOTAL')}
          </Heading>
          <DisplayTotalAmount cost={cart.cost} hasDiscount={hasDiscount} />
        </TotalWrapper>
        {campaigns.map((campaign) => (
          <DiscountMessage key={campaign.discount.type}>
            {getDiscountDurationExplanation(campaign.discount, cart.cost.gross)}
          </DiscountMessage>
        ))}
      </Footer>
    </Space>
  )
}

type DisplayTotalAmountProps = {
  cost: CartFragmentFragment['cost']
  hasDiscount: boolean
}
const DisplayTotalAmount = ({ cost, hasDiscount }: DisplayTotalAmountProps) => {
  const formatter = useFormatter()
  const { gross, net } = cost

  if (hasDiscount) {
    return (
      <SpaceBetweenPrice>
        <LineThroughPrice>{formatter.monthlyPrice(gross)}</LineThroughPrice>
        <Text>{formatter.monthlyPrice(net)}</Text>
      </SpaceBetweenPrice>
    )
  }

  return <Text>{formatter.monthlyPrice(gross)}</Text>
}

const LineThroughPrice = styled(Text)(({ theme }) => ({
  color: theme.colors.textSecondary,
  textDecoration: 'line-through',
}))

const SpaceBetweenPrice = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.space[2],
}))

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

const DiscountMessage = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes[1],
}))
