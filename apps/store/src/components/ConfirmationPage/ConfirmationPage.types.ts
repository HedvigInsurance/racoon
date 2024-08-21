import type {
  TrialContractFragment,
  CurrentMemberQuery,
  CartFragment,
} from '@/services/graphql/generated'
import type { ConfirmationStory } from '@/services/storyblok/storyblok'

export type MemberPartnerData = CurrentMemberQuery['currentMember']['partnerData']

export type ConfirmationPageProps = {
  cart: CartFragment
  memberPartnerData: MemberPartnerData | null
  switching?: {
    shopSessionOutcomeId: string
    companyDisplayName: string
  }
  carTrialContract?: TrialContractFragment
  story?: ConfirmationStory
}
