import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import * as React from 'react'
import { GenericAgreement } from 'types/generated/graphql'
import { getCarrierText } from '@hope/features/contracts/utils'
import { InsuranceStatusBadge } from '@hope/features/member/tabs/contracts-tab/agreement/InsuranceStatusBadge'

const SelectableTableCell = styled(TableColumn)<{
  selected: boolean
}>`
  font-size: 1.2rem;
  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.accent} !important;
      color: ${theme.accentContrast} !important;
    `};
  width: 20%;
`

export const AgreementsTable: React.FC<{
  agreements: ReadonlyArray<GenericAgreement>
  selectedAgreement: string | undefined
  setSelectedAgreement: (agreementId: string | undefined) => void
  isContractDeleted: boolean | undefined
  isContractLocked: boolean | undefined
}> = ({
  agreements,
  selectedAgreement,
  setSelectedAgreement,
  isContractDeleted,
  isContractLocked,
}) => {
  const getAgreementStatus = (agreement: GenericAgreement) => {
    if (isContractDeleted) {
      return 'Deleted'
    }

    if (isContractLocked) {
      return 'Locked'
    }

    return convertEnumToTitle(agreement.status)
  }

  return (
    <Table style={{ margin: '1em 0' }}>
      <TableHeader>
        <TableHeaderColumn>Line of Business</TableHeaderColumn>
        <TableHeaderColumn>Carrier</TableHeaderColumn>
        <TableHeaderColumn>From Date</TableHeaderColumn>
        <TableHeaderColumn>To Date</TableHeaderColumn>
        <TableHeaderColumn>Premium</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableHeader>
      <TableBody>
        {agreements.map((agreement) => {
          const isSelected = agreement.id === selectedAgreement
          return (
            <TableRow
              key={agreement.id}
              onClick={() =>
                selectedAgreement === agreement.id
                  ? setSelectedAgreement(undefined)
                  : setSelectedAgreement(agreement.id)
              }
              active={isSelected}
              border
            >
              <SelectableTableCell selected={isSelected}>
                {agreement.typeOfContractDisplayName}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {getCarrierText(agreement.carrier)}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {agreement.fromDate}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {agreement.toDate}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                {formatMoney(agreement.premium, { minimumFractionDigits: 0 })}
              </SelectableTableCell>
              <SelectableTableCell selected={isSelected}>
                <InsuranceStatusBadge status={agreement.status}>
                  {getAgreementStatus(agreement)}
                </InsuranceStatusBadge>
              </SelectableTableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
