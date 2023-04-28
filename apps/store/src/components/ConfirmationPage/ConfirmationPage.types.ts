import { CartFragmentFragment } from '@/services/apollo/generated'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ConfirmationPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  currency: string
  platform: 'apple' | 'google' | null
  cart: CartFragmentFragment
  shopSessionId: string
  switching?: {
    companyDisplayName: string
  }
}
