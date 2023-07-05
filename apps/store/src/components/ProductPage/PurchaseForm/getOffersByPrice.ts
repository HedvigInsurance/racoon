import { ProductOfferFragment } from '@/services/apollo/generated'

export const getOffersByPrice = (offers: Array<ProductOfferFragment>) => {
  return [...offers].sort((a, b) => {
    if (a.price.amount < b.price.amount) return -1
    if (a.price.amount > b.price.amount) return 1
    return 0
  })
}
