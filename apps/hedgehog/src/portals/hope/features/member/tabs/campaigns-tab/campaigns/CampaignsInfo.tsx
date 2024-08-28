import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { CampaignCodeInput } from '@hope/features/member/tabs/campaigns-tab/campaigns/CampaignCodeInput'
import { CampaignsRedeemedTable } from '@hope/features/member/tabs/campaigns-tab/campaigns/CampaignsRedeemedTable'
import * as React from 'react'
import { ReferralInformation } from 'types/generated/graphql'

const NoRedeemedCampaignsMessage = styled(StandaloneMessage)`
  font-size: 1.2em;
`

export const CampaignsInfo: React.FC<{
  memberId: string
  referralInformation: ReferralInformation
}> = ({ memberId, referralInformation }) => {
  return (
    <CardsWrapper>
      <Card>
        <ThirdLevelHeadline>Redeemed campaigns</ThirdLevelHeadline>
        {referralInformation.redeemedCampaigns.length !== 0 && (
          <CampaignsRedeemedTable
            memberId={memberId}
            campaignsRedeemed={referralInformation.redeemedCampaigns}
          />
        )}

        {referralInformation.redeemedCampaigns.length === 0 && (
          <NoRedeemedCampaignsMessage paddingTop="2em" paddingBottom="2em">
            No campaigns redeemed
          </NoRedeemedCampaignsMessage>
        )}

        <CampaignCodeInput memberId={memberId} />
      </Card>
    </CardsWrapper>
  )
}
