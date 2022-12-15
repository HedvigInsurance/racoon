export type CartEntry = {
  offerId: string
  title: string
  cost: number
  currencyCode: string
  startDate?: Date
}

export type CartCampaign = { id: string; displayName: string }

export type CartCost = {
  currencyCode: string
  amount: number
  crossOutAmount?: number
}
