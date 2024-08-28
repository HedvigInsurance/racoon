import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  FadeIn,
  Flex,
  InfoTag,
  LoadingMessage,
  MainHeadline,
  Popover,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { CountryCode } from '@hope/features/config/constants'
import { getLastTerminationDate } from '@hope/features/contracts/utils'
import { useGetMasterLedgerBreakdown } from '@hope/features/member/tabs/account-tab/hooks/use-get-master-ledger-breakdown'
import {
  FetchingAccountTopCard,
  AccountTopCard,
} from '@hope/features/member/tabs/account-tab/AccountTopCard'
import { SettlementEntryTable } from '@hope/features/member/tabs/account-tab/SettlementEntryTable'
import * as React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import { Settlement } from 'types/generated/graphql'
import { RefreshButton } from '../shared/refresh-button'

const NoTableMessage = styled(StandaloneMessage)`
  font-size: 1.1em;
`

function isDateBeforeTodayOrToday(date: string) {
  return new Date(date) <= new Date()
}

export const AccountTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [memberData, { loading, refetch, error }] =
    useGetMasterLedgerBreakdown(memberId)

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }
  if (error || !memberData) {
    return (
      <StandaloneMessage paddingTop="10vh">No account found</StandaloneMessage>
    )
  }

  const breakdown = memberData.masterLedgerBreakdown
  const pendingSettlements = breakdown.settlements.filter(
    (s: Settlement) =>
      s.status === 'PENDING' ||
      s.status === 'SENT_TO_PAYMENT_SERVICE' ||
      s.status === 'SENT_TO_PAYMENT_PROVIDER',
  )

  const latestTerminationDate = getLastTerminationDate(memberData.contracts)
  const writeOffUpcomingChargeEnabled =
    latestTerminationDate != null
      ? isDateBeforeTodayOrToday(latestTerminationDate)
      : false

  return (
    <FadeIn>
      <MainHeadline>
        Account
        <RefreshButton onClick={() => refetch()} isloading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>

      {breakdown.upcomingChargeEstimation && (
        <AccountTopCard
          title="Upcoming charge"
          amount={breakdown.upcomingChargeEstimation.amount}
          currency={breakdown.upcomingChargeEstimation.currency}
          chargeDueDate={breakdown.upcomingChargeEstimation.chargeDueDate}
          entries={breakdown.upcomingChargeEstimation.accountEntries}
          writeOffUpcomingChargeEnabled={writeOffUpcomingChargeEnabled}
          memberId={memberId}
        />
      )}
      {pendingSettlements.length != 0 &&
        pendingSettlements.map((pendingSettlement) => (
          <FetchingAccountTopCard
            title="Pending settlement"
            amount={pendingSettlement.amount}
            currency={pendingSettlement.currency}
            chargeDueDate={undefined}
            settlementId={pendingSettlement.settlementId}
          />
        ))}
      {breakdown.outstandingAmountBreakdown && (
        <AccountTopCard
          title="Outstanding Amount"
          amount={breakdown.outstandingAmountBreakdown.amount}
          currency={breakdown.outstandingAmountBreakdown.currency}
          chargeDueDate={undefined}
          entries={breakdown.outstandingAmountBreakdown.accountEntries}
          isOutstandingDebtCard={true}
          deptToMember={
            parseFloat(breakdown.outstandingAmountBreakdown.amount) < 0
          }
          memberId={memberId}
          canPreformAutomaticPayout={
            memberData.payoutMethodStatus?.activated === true &&
            memberData.countryCode === CountryCode.SE
          }
        />
      )}
      <CardsWrapper>
        <Card>
          <Flex justify="space-between">
            <Flex>
              <ThirdLevelHeadline>Settlements</ThirdLevelHeadline>
              <Spacing left="small">
                <Popover
                  contents={
                    <>
                      This is a list of all settlements for a <br />
                      member. Settlements is created to settle <br />
                      the members debt towards us. Clicking on a <br />
                      shows what was settled.
                    </>
                  }
                >
                  <InfoTag status="info">How does it work?</InfoTag>
                </Popover>
              </Spacing>
            </Flex>
          </Flex>
          {breakdown.settlements.length !== 0 ? (
            <Spacing top="medium">
              <SettlementEntryTable settlements={breakdown.settlements} />
            </Spacing>
          ) : (
            <NoTableMessage paddingTop="4em" paddingBottom="2em">
              No account entries
            </NoTableMessage>
          )}
        </Card>
      </CardsWrapper>
    </FadeIn>
  )
}
