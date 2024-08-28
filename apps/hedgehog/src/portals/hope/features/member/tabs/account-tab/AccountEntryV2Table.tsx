import styled from '@emotion/styled'
import {
  Bold,
  FadeIn,
  Capitalized,
  LoadingMessage,
  Popover,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  Spacing,
  InfoRow,
  convertEnumToTitle,
} from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import { useGetAccountEntriesToSettlement } from '@hope/features/member/tabs/account-tab/hooks/use-get-account-entries-to-settlement'
import * as React from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { AccountEntryV2 } from 'types/generated/graphql'
import { Theme } from '@emotion/react'
import { filterOutAccountEntriesWithCancelledContract } from '@hope/features/member/tabs/account-tab/util/filterAccountEntries'

export const PopoverItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`

const getAccountEntryColor = (theme: Theme, entry: AccountEntryV2) => {
  if (entry.type == 'SUBSCRIPTION') {
    if (+entry.amount < 0) {
      return theme.lightDanger
    }
    return theme.lightSuccess
  }

  if (entry.type == 'TAX') {
    if (+entry.amount < 0) {
      return theme.lightDanger
    }
    return theme.accentLight
  }

  if (entry.type == 'DISCOUNT') {
    if (+entry.amount > 0) {
      return theme.lightDanger
    }
    return theme.highlight
  }

  if (
    entry.type == 'SETTLEMENT_ADJUSTMENT' ||
    entry.type == 'CARRIED_ADJUSTMENT' ||
    entry.type == 'MIGRATION_CORRECTION' ||
    entry.type == 'ROUNDING'
  ) {
    return theme.lightWarning
  }

  return theme.backgroundTransparent
}

const entryTypeExplanation = (type: string) => {
  switch (type) {
    case 'SUBSCRIPTION':
      return 'The insurance cost (ex. taxes)'
    case 'TAX':
      return 'The taxes for the insurance'
    case 'DISCOUNT':
      return 'The member discount broken down on the insurance(s)'
    case 'SETTLEMENT_ADJUSTMENT':
      return (
        'An adjustment to even out the entries to the created settlement.\n' +
        'This is followed by an carried adjustment'
      )
    case 'CARRIED_ADJUSTMENT':
      return 'A carried adjustment to carry the debt forward\n(usually to the next month)'
    case 'MIGRATION_CORRECTION':
      return 'A correction created to fix the member balance'
    case 'ROUNDING':
      return 'A correction to fix a rounding issue'
  }

  return 'Unknown'
}

const TableRowColored = styled(TableRow)<{
  entry: AccountEntryV2
}>`
  td {
    background-color: ${({ theme, entry }) =>
      getAccountEntryColor(theme, entry)} !important;
  }
`

const StyledTable = styled(Table)`
  overflow: visible !important;
`

export const AccountEntryV2ToSettlementTable: React.FC<{
  settlementId: string
}> = ({ settlementId }) => {
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

  const filteredEntries = filterOutAccountEntriesWithCancelledContract(entries)

  return (
    <FadeIn>
      <AccountEntryV2Table entries={filteredEntries} />
    </FadeIn>
  )
}

export const WrappedAccountEntryV2Table: React.FC<{
  entries: AccountEntryV2[]
}> = ({ entries }) => (
  <Spacing top="medium">
    <InfoRow>Account Entries</InfoRow>
    <Spacing top="small">
      <AccountEntryV2Table entries={entries} />
    </Spacing>
  </Spacing>
)

const AccountEntryV2Table: React.FC<{
  entries: AccountEntryV2[]
}> = ({ entries }) => (
  <StyledTable>
    <TableHeader>
      <TableHeaderColumn>Due Date</TableHeaderColumn>
      <TableHeaderColumn>Type</TableHeaderColumn>
      <TableHeaderColumn>Subtype</TableHeaderColumn>
      <TableHeaderColumn>Insurance type</TableHeaderColumn>
      <TableHeaderColumn>Amount</TableHeaderColumn>
      <TableHeaderColumn style={{ width: 90, textAlign: 'center' }}>
        Details
      </TableHeaderColumn>
    </TableHeader>

    <TableBody>
      {entries.map((entry) => (
        <TableRowColored entry={entry} key={entry.entryId}>
          <TableColumn>{entry.chargeDueDate}</TableColumn>
          <TableColumn>
            <Popover
              contents={
                <>
                  <PopoverItem>{entryTypeExplanation(entry.type)}</PopoverItem>
                </>
              }
            >
              <Capitalized>{convertEnumToTitle(entry.type)}</Capitalized>
            </Popover>
          </TableColumn>
          <TableColumn>{convertEnumToTitle(entry.subtype ?? '')}</TableColumn>
          <TableColumn>
            {convertEnumToTitle(entry.instalment?.insuranceType ?? '')}
          </TableColumn>
          <TableColumn>
            {formatMoney(
              { amount: entry.amount, currency: entry.currency },
              {
                useGrouping: true,
                minimumFractionDigits: 2,
              },
            )}
          </TableColumn>
          <TableColumn style={{ textAlign: 'center', width: 90 }}>
            <Popover
              contents={
                <>
                  <PopoverItem>
                    <Bold>Account Entry ID</Bold>
                    {entry.entryId}
                  </PopoverItem>
                  {entry.instalment && (
                    <PopoverItem>
                      <Bold>Agreement Id</Bold>
                      {entry.instalment.agreementId}
                    </PopoverItem>
                  )}
                  {entry.instalment && (
                    <PopoverItem>
                      <Bold>Instalment Id</Bold>
                      {entry.instalment.instalmentId}
                    </PopoverItem>
                  )}
                  {entry.instalment && (
                    <PopoverItem>
                      <Bold>Period Start</Bold>
                      {entry.instalment.periodStart}
                    </PopoverItem>
                  )}
                  {entry.instalment && (
                    <PopoverItem>
                      <Bold>Period End</Bold>
                      {entry.instalment.periodEnd}
                    </PopoverItem>
                  )}
                  {entry.createdAt && (
                    <PopoverItem>
                      <Bold>Created at</Bold>
                      {format(parseISO(entry.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                    </PopoverItem>
                  )}
                  {entry.comment && (
                    <PopoverItem>
                      <Bold>Comment</Bold>
                      {entry.comment}
                    </PopoverItem>
                  )}
                </>
              }
            >
              <InfoCircleFill />
            </Popover>
          </TableColumn>
        </TableRowColored>
      ))}
    </TableBody>
  </StyledTable>
)
