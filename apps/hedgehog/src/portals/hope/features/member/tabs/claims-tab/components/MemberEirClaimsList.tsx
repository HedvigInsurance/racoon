import styled from '@emotion/styled'
import {
  LoadingMessage,
  Monetary,
  Placeholder,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  convertEnumToTitle,
} from '@hedvig-ui'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import { useMemo } from 'react'
import * as React from 'react'
import { useGetMemberEirClaims } from '../hooks/use-get-member-eir-claims'
import { ClaimState } from '@hope/features/config/constants'

const EirClaimStateBadge = styled.span<{ state: string }>`
  display: inline-block;
  min-width: 8em;
  text-align: center;
  padding: 0.3em 1em;
  background-color: ${({ theme, state }) =>
    state === ClaimState.Closed ? theme.success : theme.accent};
  color: ${({ theme }) => theme.accentContrast};
  font-size: 0.8em;
  border-radius: 8px;
`

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
`

export const MemberEirClaimsList: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [memberClaims, { loading }] = useGetMemberEirClaims(memberId)

  const claims = useMemo(() => memberClaims ?? [], [memberClaims])

  const claimsList = useMemo(() => {
    return claims
  }, [claims])

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (claimsList.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        No Eir claims for member
      </StandaloneMessage>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Synced at</TableHeaderColumn>
        <TableHeaderColumn>Insurance</TableHeaderColumn>
        <TableHeaderColumn>Reg. Number</TableHeaderColumn>
        <TableHeaderColumn>Type & Outcome</TableHeaderColumn>
        <TableHeaderColumn>State</TableHeaderColumn>
        <TableHeaderColumn>Payments</TableHeaderColumn>
        <TableHeaderColumn>Reserves</TableHeaderColumn>
      </TableHeader>
      <TableBody>
        {claimsList.map((claim, index) => {
          const syncedAtString = claim.syncedAt
            ? formatDate(parseISO(claim.syncedAt), 'dd MMMM, yyyy')
            : undefined
          const syncedAtTimeString = claim.syncedAt
            ? formatDate(parseISO(claim.syncedAt), 'HH:mm')
            : undefined
          const claimState = claim?.subclaims?.every(
            (subclaim) => !!subclaim?.closedAt,
          )
            ? ClaimState.Closed
            : ClaimState.Open
          return (
            <TableRow
              key={claim.id}
              index={index}
              length={claimsList.length}
              topElement="Claims - Create"
              tabIndex={0}
            >
              <TableColumn>
                {syncedAtString && syncedAtTimeString ? (
                  <FlexVertically>
                    {syncedAtString}
                    <TableColumnSubtext>
                      {syncedAtTimeString}
                    </TableColumnSubtext>
                  </FlexVertically>
                ) : (
                  <Placeholder>Not opened</Placeholder>
                )}
              </TableColumn>

              <TableColumn>
                {claim.contract?.insuranceType ? (
                  <FlexVertically>
                    {convertEnumToTitle(claim.contract.insuranceType)}
                    <TableColumnSubtext>
                      {convertEnumToTitle(
                        claim.agreement?.typeOfContract ?? '',
                      )}
                    </TableColumnSubtext>
                  </FlexVertically>
                ) : (
                  <Placeholder>Insurance not specified</Placeholder>
                )}
                <TableColumnSubtext>
                  {claim.agreement?.name ?? ''}
                </TableColumnSubtext>
              </TableColumn>

              <TableColumn>
                <FlexVertically>
                  {claim?.agreement?.registrationNumber ? (
                    claim.agreement.registrationNumber
                  ) : (
                    <Placeholder>Not specified</Placeholder>
                  )}
                </FlexVertically>
              </TableColumn>

              <TableColumn>
                <FlexVertically>
                  {claim?.subclaims?.[0]?.type?.displayName ? (
                    convertEnumToTitle(claim.subclaims[0].type.displayName!)
                  ) : (
                    <Placeholder>Type not specified</Placeholder>
                  )}
                  <TableColumnSubtext>
                    {claim?.overriddenOutcome ? (
                      convertEnumToTitle(claim.overriddenOutcome!)
                    ) : (
                      <Placeholder>Outcome not specified</Placeholder>
                    )}
                  </TableColumnSubtext>
                </FlexVertically>
              </TableColumn>

              <TableColumn>
                <EirClaimStateBadge state={claimState}>
                  {convertEnumToTitle(claimState)}
                </EirClaimStateBadge>
              </TableColumn>

              <TableColumn>
                {claim.subclaims.some((subclaim) => !!subclaim.payment) ? (
                  <Monetary
                    amount={{
                      amount: claim.subclaims.reduce(
                        (acc, subclaim) => acc + subclaim.payment,
                        0,
                      ),
                      currency: 'SEK',
                    }}
                  />
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>

              <TableColumn>
                {claim.subclaims.some((subclaim) => !!subclaim.reserve) ? (
                  <Monetary
                    amount={{
                      amount: claim.subclaims.reduce((acc, subclaim) => {
                        if (!subclaim.reserve) {
                          return acc
                        }
                        return acc + subclaim.reserve
                      }, 0),
                      currency: 'SEK',
                    }}
                  />
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
