import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  InfoRow,
  InfoTag,
  InfoText,
  Placeholder,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { SmallTopSpacing } from '@hope/features/member/tabs/campaigns-tab/styles'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { MemberReferral, ReferralInformation } from 'types/generated/graphql'
import { MembersReferredTable } from './MembersReferredTable'

const MemberLink: React.FC<{ memberReferral: MemberReferral }> = ({
  memberReferral,
}) => {
  return (
    <SmallTopSpacing>
      <Link to={`/members/${memberReferral.memberId}`}>
        {memberReferral.name}
      </Link>
    </SmallTopSpacing>
  )
}

const NotAvailable: React.FC = () => (
  <SmallTopSpacing>
    <Placeholder>Not available</Placeholder>
  </SmallTopSpacing>
)

const NoMembersReferredMessage = styled(StandaloneMessage)`
  font-size: 1.2em;
`

export const ReferralsInfo: React.FC<{
  referralInformation: ReferralInformation
}> = ({ referralInformation }) => {
  const { eligible } = referralInformation

  return (
    <>
      <CardsWrapper>
        <Card>
          <ThirdLevelHeadline>Referral Information</ThirdLevelHeadline>
          <InfoRow>
            Hedvig Forever
            <InfoText>
              {referralInformation ? (
                <InfoTag status={eligible ? 'success' : 'danger'}>
                  <span style={{ fontWeight: 'bold' }}>
                    {eligible ? 'Activated' : 'Disabled'}
                  </span>
                </InfoTag>
              ) : (
                <NotAvailable />
              )}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Referral code
            <InfoText>
              {eligible ? (
                <InfoTag status="highlight">
                  <span style={{ fontWeight: 'bold' }}>
                    {referralInformation?.campaign.code.toUpperCase()}
                  </span>
                </InfoTag>
              ) : (
                <NotAvailable />
              )}
            </InfoText>
          </InfoRow>
          <InfoRow>
            Referred by
            <InfoText>
              {eligible && referralInformation?.referredBy ? (
                <MemberLink memberReferral={referralInformation?.referredBy} />
              ) : (
                <NotAvailable />
              )}
            </InfoText>
          </InfoRow>
        </Card>
      </CardsWrapper>

      {eligible && (
        <CardsWrapper>
          <Card>
            <ThirdLevelHeadline>Members referred</ThirdLevelHeadline>
            {referralInformation?.hasReferred?.length !== 0 ? (
              <MembersReferredTable members={referralInformation.hasReferred} />
            ) : (
              <NoMembersReferredMessage paddingTop="2em" paddingBottom="2em">
                No members referred
              </NoMembersReferredMessage>
            )}
          </Card>
        </CardsWrapper>
      )}
    </>
  )
}
