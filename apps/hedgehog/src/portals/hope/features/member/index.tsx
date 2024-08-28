import styled from '@emotion/styled'
import { Capitalized, Tabs } from '@hedvig-ui'
import { memberPagePanes } from '@hope/features/member/tabs'
import { FraudulentStatus } from '@hope/features/member/tabs/member-tab/FraudulentStatus'
import { getMemberFlag, MemberAge } from '@hope/features/member/utils'
import { MemberDetails } from './MemberDetails'
import { PickedLocale } from '@hope/features/config/constants'
import { useTitle } from '@hedvig-ui'
import { usePushMemberHistory } from '@hope/common/hooks/use-push-member-history'
import { ClaimsTab } from '@hope/features/member/tabs/claims-tab/ClaimsTab'
import { MemberFilesTab } from '@hope/features/member/tabs/files-tab/FileTab'
import { ContractTab } from '@hope/features/member/tabs/contracts-tab'
import { QuotesTab } from '@hope/features/member/tabs/quote-tab/QuotesTab'
import { PaymentsTab } from '@hope/features/member/tabs/payments-tab/PaymentsTab'
import { AccountTab } from '@hope/features/member/tabs/account-tab'
import { MemberTab } from '@hope/features/member/tabs/member-tab/MemberTab'
import { CampaignsTab } from '@hope/features/member/tabs/campaigns-tab'
import { Tags } from '@hope/features/tags/Tags'
import { useGetMemberInfo } from './tabs/member-tab/hooks/use-get-member-info'
import { HopeAuthGuard, hopeAuthPermissions } from 'auth'

const MemberPageContainer = styled.div<{ chat?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
  width: ${({ chat }) => (chat ? 'calc(100% - 425px)' : '100%')};
  min-width: 700px;
  white-space: nowrap;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 32px;
`

const Flag = styled.div`
  display: inline-flex;
  font-size: 3rem;
  margin-left: 0.5rem;
`

export const MemberPageContent = ({
  memberId,
  tab,
  onChangeTab,
  onClickClaim,
  title,
}: {
  memberId: string
  tab: string
  onChangeTab: (newTab: string) => void
  onClickClaim: (claimId: string) => void
  title?: string
}) => {
  const [member] = useGetMemberInfo(memberId)

  useTitle(
    title ??
      (member ? `${member?.firstName} ${member?.lastName}` : 'Loading...'),
  )

  const panes = memberPagePanes(member?.memberId)
  usePushMemberHistory(member?.memberId)

  if (!member) {
    return null
  }

  const paneComponent = () => {
    switch (tab) {
      case 'claims':
        return (
          <HopeAuthGuard requires={hopeAuthPermissions.claims['claims:read']}>
            <ClaimsTab memberId={memberId} onClickClaim={onClickClaim} />
          </HopeAuthGuard>
        )
      case 'files':
        return <MemberFilesTab memberId={memberId} />
      case 'contracts':
        return <ContractTab memberId={memberId} />
      case 'quotes':
        return <QuotesTab memberId={memberId} />
      case 'payments':
        return <PaymentsTab memberId={memberId} />
      case 'account':
        return <AccountTab memberId={memberId} />
      case 'member':
        return <MemberTab memberId={memberId} />
      case 'campaigns':
        return <CampaignsTab memberId={memberId} />
    }
  }

  return (
    <MemberPageContainer>
      <Header>
        <div style={{ marginRight: 15 }}>
          <FraudulentStatus
            statusInfo={{
              status: member.fraudulentStatus,
              description: member.fraudulentStatusDescription,
            }}
          />
        </div>
        <Capitalized style={{ marginRight: 8 }}>
          {member.firstName || ''}
        </Capitalized>
        <Capitalized style={{ marginRight: 8 }}>
          {member.lastName || ''}
        </Capitalized>
        (<MemberAge birthDateString={member?.birthDate} />)
        {member && (
          <>
            <Flag>
              {getMemberFlag(
                member?.contractMarketInfo,
                member.pickedLocale as PickedLocale,
              )}
            </Flag>
          </>
        )}
      </Header>
      <Tags resourceId={memberId} tags={member?.tags ?? []} />
      <MemberDetails memberId={memberId} member={member} />
      <Tabs
        list={panes.map((pane) => ({
          title: pane.tabTitle,
          active: tab === pane.tabName,
          action: () => onChangeTab(pane.tabName),
          hotkey: pane.hotkey,
        }))}
      />
      <div style={{ marginTop: '1rem' }}>{paneComponent()}</div>
    </MemberPageContainer>
  )
}
