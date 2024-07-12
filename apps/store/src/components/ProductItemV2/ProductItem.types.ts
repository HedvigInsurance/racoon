import { type ProductOfferFragment } from '@/services/graphql/generated'

export type Offer = Pick<
  ProductOfferFragment,
  | 'id'
  | 'cost'
  | 'priceIntentData'
  | 'startDate'
  | 'displayItems'
  | 'deductible'
  | 'variant'
  | 'product'
  | 'exposure'
  | 'cancellation'
>
