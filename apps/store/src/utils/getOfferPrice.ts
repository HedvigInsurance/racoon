import { type ComponentProps } from 'react'
import { Price } from '@/components/Price'
import { ProductOfferCost } from '@/services/graphql/generated'

type Cost = Pick<ProductOfferCost, 'net' | 'gross' | 'discount'>

export const getOfferPrice = (cost: Cost): ComponentProps<typeof Price> => ({
  currencyCode: cost.net.currencyCode,
  amount: cost.gross.amount,
  reducedAmount: cost.discount.amount > 0 ? cost.net.amount : undefined,
})
