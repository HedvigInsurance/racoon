import { CartFragmentFragment } from '@/services/apollo/generated'
import { ConfirmationStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ConfirmationPageProps = StoryblokPageProps & {
  currency: string
  platform: 'apple' | 'google' | null
  cart: CartFragmentFragment
  story: ConfirmationStory
}
