import { CartFragmentFragment, ProductOfferFragment } from '@/services/apollo/generated'
import { Money } from '@/utils/formatter'

type DisplayItem = {
  title: string
  value: string
}

export type CartEntry = {
  offerId: string
  title: string
  cost: ProductOfferFragment['cost']
  startDate?: Date | null
  pillow: { src: string; alt?: string }
  documents: CartFragmentFragment['entries'][number]['variant']['documents']
  productName: string
  data: Record<string, unknown>
  displayItems: Array<DisplayItem>
  tierLevelDisplayName?: string
  deductibleDisplayName?: string
}

export type CartCampaign = {
  id: string
  code: string
  discountExplanation: string
  discountDurationExplanation: string
}

export type CartCost = {
  total: Money
  crossOut?: Money
}
