import { Money } from '@/services/graphql/generated'

type SortableOffer = {
  cost: {
    net: Money
  }
}

export const getOffersByPrice = <T extends SortableOffer>(offers: Array<T>) => {
  return [...offers].sort((a, b) => {
    if (a.cost.net.amount < b.cost.net.amount) return -1
    if (a.cost.net.amount > b.cost.net.amount) return 1
    return 0
  })
}
