import { CartCost, CartCampaign } from '@/components/CartInventory/CartInventory.types'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { Money } from '@/utils/formatter'

export type CartEntry = {
  offerId: string
  title: string
  cost: Money
  startDate?: Date
}

export type CartPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
  cartId: string
  cost: CartCost
  campaigns: Array<CartCampaign>
  entries: Array<CartEntry>
}
