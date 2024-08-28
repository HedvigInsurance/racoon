import styled from '@emotion/styled'
import {
  Card,
  CardsWrapper,
  FadeIn,
  Flex,
  formatMoney,
  InfoContainer,
  InfoRow,
  InfoText,
  LoadingMessage,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { WrappedAccountEntryV2Table } from '@hope/features/member/tabs/account-tab/AccountEntryV2Table'
import { useGetAccountEntriesToSettlement } from '@hope/features/member/tabs/account-tab/hooks/use-get-account-entries-to-settlement'
import { RefundDeptToMemberButton } from '@hope/features/member/tabs/account-tab/RefundDeptToMemberButton'
import * as React from 'react'
import { AccountEntryV2 } from 'types/generated/graphql'
import { WriteOffMemberDebtButton } from './WriteOffMemberDebtButton'
import { filterOutAccountEntriesWithCancelledContract } from '@hope/features/member/tabs/account-tab/util/filterAccountEntries'

const NoTableMessage = styled(StandaloneMessage)`
  font-size: 1.1em;
`
const moneyOptions = {
  minimumFractionDigits: 2,
  useGrouping: true,
}

export const FetchingAccountTopCard: React.FC<{
  title: string
  amount: string
  currency: string
  chargeDueDate: string | undefined
  settlementId: string
}> = ({ title, amount, currency, chargeDueDate, settlementId }) => {
  const [entries, { loading, error }] =
    useGetAccountEntriesToSettlement(settlementId)

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }
  if (error || !entries) {
    return (
      <StandaloneMessage paddingTop="10vh">No account found</StandaloneMessage>
    )
  }

  return (
    <AccountTopCard
      title={title}
      amount={amount}
      currency={currency}
      chargeDueDate={chargeDueDate}
      entries={entries}
    />
  )
}

export const AccountTopCard: React.FC<{
  title: string
  amount: string
  currency: string
  chargeDueDate?: string
  entries: AccountEntryV2[]
  isOutstandingDebtCard?: boolean
  writeOffUpcomingChargeEnabled?: boolean
  memberId?: string
  deptToMember?: boolean
  canPreformAutomaticPayout?: boolean
}> = ({
  title,
  amount,
  currency,
  chargeDueDate,
  entries,
  isOutstandingDebtCard,
  writeOffUpcomingChargeEnabled,
  memberId,
  deptToMember,
  canPreformAutomaticPayout,
}) => {
  const filteredEntries = filterOutAccountEntriesWithCancelledContract(entries)
  return (
    <FadeIn>
      <CardsWrapper>
        <Card>
          <InfoContainer>
            <InfoRow>
              <ThirdLevelHeadline>{title}</ThirdLevelHeadline>
              {chargeDueDate && <InfoText>{chargeDueDate}</InfoText>}
              {isOutstandingDebtCard && !deptToMember && memberId && (
                <WriteOffMemberDebtButton
                  memberId={memberId}
                  untilIncludingDate={null}
                />
              )}
              {isOutstandingDebtCard && deptToMember && memberId && (
                <div>
                  {canPreformAutomaticPayout && (
                    <RefundDeptToMemberButton
                      memberId={memberId}
                      initiateAutomaticPayout={true}
                    />
                  )}
                  <RefundDeptToMemberButton
                    memberId={memberId}
                    initiateAutomaticPayout={false}
                  />
                </div>
              )}
            </InfoRow>
            <InfoRow>
              Amount:{' '}
              {formatMoney(
                {
                  amount: amount,
                  currency: currency,
                },
                moneyOptions,
              )}
              {writeOffUpcomingChargeEnabled && memberId && chargeDueDate && (
                <WriteOffMemberDebtButton
                  memberId={memberId}
                  untilIncludingDate={chargeDueDate}
                />
              )}
            </InfoRow>
          </InfoContainer>
          <Flex justify="space-between">
            <Flex>
              {filteredEntries ? (
                <WrappedAccountEntryV2Table entries={filteredEntries} />
              ) : (
                <NoTableMessage paddingTop="4em" paddingBottom="2em">
                  No account entries
                </NoTableMessage>
              )}
            </Flex>
          </Flex>
        </Card>
      </CardsWrapper>
    </FadeIn>
  )
}
