import { CartFragmentFragment } from '@/services/apollo/generated'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ConfirmationPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  currency: string
  cart: CartFragmentFragment
  shopSessionId: string
  switching?: {
    companyDisplayName: string
  }
}
