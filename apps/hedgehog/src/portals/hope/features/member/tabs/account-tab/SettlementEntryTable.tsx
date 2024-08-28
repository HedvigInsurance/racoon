import styled from '@emotion/styled'
import {
  Bold,
  Capitalized,
  convertEnumToTitle,
  Popover,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import { AccountEntryV2ToSettlementTable } from '@hope/features/member/tabs/account-tab/AccountEntryV2Table'
import { useState } from 'react'
import * as React from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { Settlement } from 'types/generated/graphql'
import { Theme } from '@emotion/react'

export const PopoverItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`

const getSettlementEntryColor = (theme: Theme, settlement: Settlement) => {
  if (settlement.status == 'FAILED') {
    return theme.lightDanger
  }

  if (settlement.type == 'CHARGE' && settlement.status == 'SUCCESS') {
    return theme.lightSuccess
  }

  if (settlement.type == 'CHARGE') {
    return theme.lightWarning
  }

  return theme.backgroundTransparent
}

const settlementTypeExplanation = (type: string) => {
  switch (type) {
    case 'CHARGE':
      return 'A charge to settle the members debt towards us'
    case 'LOSS':
      return 'Member debt we marked as loss, look at comment to see why'
    case 'OFFSET':
      return 'Settle entries that has a sum of 0'
    case 'WRITE_OFF':
      return 'Debt we had to the member that is written off'
  }
  return 'Unknown'
}

const TableRowColored = styled(TableRow)<{
  settlement: Settlement
}>`
  td {
    background-color: ${({ theme, settlement }) =>
      getSettlementEntryColor(theme, settlement)} !important;
  }
`

const StyledTable = styled(Table)`
  overflow: visible !important;
`

const NumberCell = styled(TableColumn)<{
  settlement: Settlement
}>`
  text-decoration: ${({ settlement }) =>
    settlement.status === 'FAILED' ? 'line-through' : ''};
`

export const SettlementEntryTable: React.FC<{
  settlements: Settlement[]
}> = ({ settlements }) => {
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null)
  return (
    <StyledTable>
      <TableHeader>
        <TableHeaderColumn>Created</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Amount</TableHeaderColumn>
        <TableHeaderColumn style={{ width: 90, textAlign: 'center' }}>
          Details
        </TableHeaderColumn>
      </TableHeader>

      <TableBody>
        {settlements.map((settlement, index) => (
          <React.Fragment key={settlement.settlementId}>
            <TableRowColored
              settlement={settlement}
              key={settlement.settlementId}
              onClick={() =>
                setOpenRowIndex(openRowIndex === index ? null : index)
              }
            >
              <TableColumn>
                {format(parseISO(settlement.createdAt), 'yyyy-MM-dd HH:mm:ss')}
              </TableColumn>
              <TableColumn>
                <Popover
                  contents={
                    <>
                      <PopoverItem>
                        {settlementTypeExplanation(settlement.type)}
                      </PopoverItem>
                    </>
                  }
                >
                  <Capitalized>
                    {convertEnumToTitle(settlement.type)}
                  </Capitalized>
                </Popover>
              </TableColumn>
              <TableColumn>{convertEnumToTitle(settlement.status)}</TableColumn>
              <NumberCell settlement={settlement}>
                {formatMoney(
                  { amount: settlement.amount, currency: settlement.currency },
                  {
                    useGrouping: true,
                    minimumFractionDigits: 2,
                  },
                )}
              </NumberCell>
              <TableColumn style={{ textAlign: 'center', width: 90 }}>
                <Popover
                  contents={
                    <>
                      <PopoverItem>
                        <Bold>Settlement ID</Bold>
                        {settlement.settlementId}
                      </PopoverItem>
                      {settlement.settledAt && (
                        <PopoverItem>
                          <Bold>Settled at</Bold>
                          {format(
                            parseISO(settlement.settledAt),
                            'yyyy-MM-dd HH:mm:ss',
                          )}
                        </PopoverItem>
                      )}
                      {settlement.transactionId && (
                        <PopoverItem>
                          <Bold>Transaction id</Bold>
                          {settlement.transactionId}
                        </PopoverItem>
                      )}
                      {settlement.comment && (
                        <PopoverItem>
                          <Bold>Comment</Bold>
                          {settlement.comment}
                        </PopoverItem>
                      )}
                    </>
                  }
                >
                  <InfoCircleFill />
                </Popover>
              </TableColumn>
            </TableRowColored>
            {openRowIndex === index && (
              <tr>
                <td colSpan={5}>
                  <AccountEntryV2ToSettlementTable
                    settlementId={settlement.settlementId}
                  />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </StyledTable>
  )
}
