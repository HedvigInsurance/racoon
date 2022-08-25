import { StoryblokPageProps } from '@/services/storyblok/storyblok'

type CostData = { total: number }
type ProductData = { name: string; startDate: string }

export type ConfirmationPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  currency: string
  cost: CostData
  firstName: string
  products: Array<ProductData>
  platform: 'apple' | 'google' | null
}
