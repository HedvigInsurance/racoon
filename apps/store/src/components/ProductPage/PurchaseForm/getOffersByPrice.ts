import { ProductOfferFragment } from '@/services/apollo/generated'

export const getOffersByPrice = (offers: Array<ProductOfferFragment>) => {
  return [...offers].sort((a, b) => {
    if (a.cost.net.amount < b.cost.net.amount) return -1
    if (a.cost.net.amount > b.cost.net.amount) return 1
    return 0
  })
}
