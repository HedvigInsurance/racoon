import { CartFragmentFragment, CurrentMemberQuery } from '@/services/apollo/generated'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type MemberPartnerData = CurrentMemberQuery['currentMember']['partnerData']

export type ConfirmationPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
  cart: CartFragmentFragment
  switching?: {
    shopSessionOutcomeId: string
    companyDisplayName: string
  }
  memberPartnerData: MemberPartnerData | null
}
