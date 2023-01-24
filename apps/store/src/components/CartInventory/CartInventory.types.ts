import { CartFragmentFragment } from '@/services/apollo/generated'
import { Money } from '@/utils/formatter'

export type CartEntry = {
  offerId: string
  title: string
  cost: Money
  startDate?: Date | null
  pillow: { src: string; alt?: string }
  documents: CartFragmentFragment['entries'][number]['variant']['documents']
  productName: string
  data: Record<string, unknown>
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
