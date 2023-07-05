import { ProductOfferFragment } from '@/services/apollo/generated'
import { Features } from '@/utils/Features'

export const getOffersByPrice = (offers: Array<ProductOfferFragment>) => {
  return [...offers].sort(Features.enabled('DISCOUNTS') ? sortByCost : sortByPrice)
}

const sortByCost = (a: ProductOfferFragment, b: ProductOfferFragment) => {
  if (a.cost.net.amount < b.cost.net.amount) return -1
  if (a.cost.net.amount > b.cost.net.amount) return 1
  return 0
}

const sortByPrice = (a: ProductOfferFragment, b: ProductOfferFragment) => {
  if (a.price.amount < b.price.amount) return -1
  if (a.price.amount > b.price.amount) return 1
  return 0
}
