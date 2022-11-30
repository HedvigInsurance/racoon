import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductData = { id: string; name: string; cost: number; currency: string }
type CampaignData = { id: string; displayName: string }
type CostData = { crossOut?: number; net: number; gross: number }

export type CartPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
  cartId: string
  products: Array<ProductData>
  cost: CostData
  campaigns: Array<CampaignData>
}
