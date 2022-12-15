import { CartCost } from '@/components/CartInventory/CartInventory.types'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { Money } from '@/utils/formatter'

export type CartEntry = {
  offerId: string
  title: string
  cost: Money
  startDate?: Date
}

type CampaignData = { id: string; displayName: string }

export type CartPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
  cartId: string
  cost: CartCost
  campaigns: Array<CampaignData>
  entries: Array<CartEntry>
}
