import { Money } from '@/utils/formatter'

export type CartEntry = {
  offerId: string
  title: string
  cost: Money
  startDate?: Date
}

export type CartCampaign = { id: string; code: string; explanation: string }

export type CartCost = {
  total: Money
  crossOut?: Money
}
