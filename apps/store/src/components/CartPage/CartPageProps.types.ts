import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type CartEntry = {
  offerId: string
  title: string
  cost: number
  currencyCode: string
  startDate?: Date
}

type CampaignData = { id: string; displayName: string }
export type CostData = { currencyCode: string; net: number; crossOut?: number }

export type CartPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
  cartId: string
  cost: CostData
  campaigns: Array<CampaignData>
  entries: Array<CartEntry>
}
