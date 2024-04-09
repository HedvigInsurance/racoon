import type {
  CartFragmentFragment,
  TrialContractFragment,
  CurrentMemberQuery,
} from '@/services/graphql/generated'
import type { StoryblokPageProps } from '@/services/storyblok/storyblok'

export type MemberPartnerData = CurrentMemberQuery['currentMember']['partnerData']

export type ConfirmationPageProps = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
  cart: CartFragmentFragment
  memberPartnerData: MemberPartnerData | null
  switching?: {
    shopSessionOutcomeId: string
    companyDisplayName: string
  }
  carTrialContract?: TrialContractFragment
}
