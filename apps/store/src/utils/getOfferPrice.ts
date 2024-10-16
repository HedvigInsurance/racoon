import { type ComponentProps } from 'react'
import type { Price } from '@/components/Price'
import type { ProductOfferCost } from '@/services/graphql/generated'

type Cost = Pick<ProductOfferCost, 'net' | 'gross' | 'discount'>

export const getOfferPrice = (cost: Cost): ComponentProps<typeof Price> => ({
  currencyCode: cost.net.currencyCode,
  amount: cost.gross.amount,
  reducedAmount: cost.discount.amount > 0 ? cost.net.amount : undefined,
})
