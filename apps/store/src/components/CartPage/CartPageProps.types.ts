import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductData = { id: string; name: string; cost: number; currency: string }
type CostData = { crossOut?: number; total: number; subTotal: number }

export type CartPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  cartId: string
  products: Array<ProductData>
  cost: CostData
}
