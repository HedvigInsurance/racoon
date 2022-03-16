import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useFormattedPrice } from '@/pages/new-member/cart/hooks/use-formatted-price'
import { Price } from '../types'

export type PriceProps = {
  price: Price
}

const Amount = styled.p(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: 1.4,
  color: theme.colors.gray900,
  margin: 0,
}))

export const MonthlyPrice = ({ price }: PriceProps) => {
  const { t } = useTranslation()
  const formattedPrice = useFormattedPrice(price)

  return <Amount>{`${formattedPrice}${t('PRICE_SUFFIX_INTERVAL')}`}</Amount>
}
