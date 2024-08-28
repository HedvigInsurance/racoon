import {
  FadeIn,
  LoadingMessage,
  MainHeadline,
  StandaloneMessage,
} from '@hedvig-ui'
import { CampaignsInfo } from '@hope/features/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { useGetReferralInformation } from '@hope/features/member/tabs/campaigns-tab/hooks/use-get-referral-information'
import { ReferralsInfo } from '@hope/features/member/tabs/campaigns-tab/referrals/ReferralsInfo'
import { RefreshButton } from '@hope/features/member/tabs/shared/refresh-button'
import * as React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

export const CampaignsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [referralInformation, { loading, error, refetch }] =
    useGetReferralInformation(memberId)

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (error || !referralInformation) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Something went wrong
      </StandaloneMessage>
    )
  }

  return (
    <FadeIn>
      <MainHeadline>
        Campaigns
        <RefreshButton onClick={() => refetch()} isloading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>
      <CampaignsInfo
        memberId={memberId}
        referralInformation={referralInformation}
      />

      <ReferralsInfo referralInformation={referralInformation} />
    </FadeIn>
  )
}
