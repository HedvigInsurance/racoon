import styled from '@emotion/styled'
import {
  Button,
  convertEnumToTitle,
  FourthLevelHeadline,
  InfoTag,
  isPressing,
  Keys,
  Monetary,
  Placeholder,
  SecondLevelHeadline,
  Shadowed,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TablePageSelect,
  TableRow,
  useKeyIsPressed,
  useTitle,
} from '@hedvig-ui'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import {
  ClaimState,
  Market,
  MarketFlags,
} from '@hope/features/config/constants'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Claim } from 'types/generated/graphql'

const ClaimStateBadge = styled.span<{ state: string }>`
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

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 5em;

  width: 100%;
  height: 100%;
`

export const LargeClaimsList: React.FC<{
  claims: Claim[]
  currentPage: number
  totalPages: number
  totalClaims: number
}> = ({ claims, currentPage, totalPages, totalClaims }) => {
  const router = useRouter()
  const isCommandPressed = useKeyIsPressed(Keys.Command)

  useTitle('Claims')

  const redirectClaimHandler = (id: string) => {
    const link = `/claims/${id}`

    if (isCommandPressed) {
      window.open(link, '_blank')
      return
    }

    router.push(link)
  }

  if (!claims.length) {
    return (
      <EmptyWrapper>
        <SecondLevelHeadline>
          <Placeholder>Sorry, no claims to be found here</Placeholder>
        </SecondLevelHeadline>
        <Button
          style={{ marginTop: '1em' }}
          variant="secondary"
          onClick={() => {
            window.location.pathname = '/claims/list/1'
          }}
        >
          Go to first page
        </Button>
      </EmptyWrapper>
    )
  }

  return (
    <>
      <Shadowed
        style={{
          margin: '0 2rem 1rem auto',
        }}
      >
        <FourthLevelHeadline>
          Total Claims: <b>{totalClaims}</b>
        </FourthLevelHeadline>
      </Shadowed>

      <Table>
        <TableHeader>
          <TableHeaderColumn style={{ paddingRight: 0 }} />
          <TableHeaderColumn>Member</TableHeaderColumn>
          <TableHeaderColumn>Date Opened</TableHeaderColumn>
          <TableHeaderColumn>Type & Outcome</TableHeaderColumn>
          <TableHeaderColumn>State</TableHeaderColumn>
          <TableHeaderColumn>Payments</TableHeaderColumn>
          <TableHeaderColumn>Reserves</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {claims.map((claim, index) => {
            const openedDateString = claim?.openedAt
              ? formatDate(parseISO(claim.openedAt), 'dd MMMM, yyyy')
              : 'Not opened'
            const openedDateTimeString = claim?.openedAt
              ? formatDate(parseISO(claim.openedAt), 'HH:mm')
              : ''

            const totalPaymentAmount = claim.subclaims
              .flatMap((subclaim) => subclaim.payments)
              .reduce((acc, payment) => acc + payment.amount.amount, 0)
              .toString()
            const firstSubclaimWithPayments = claim.subclaims.find(
              ({ payments }) => !!payments.length,
            )
            const hasPayments = !!firstSubclaimWithPayments
            const paymentCurrency =
              firstSubclaimWithPayments?.payments[0].amount.currency

            const totalReserves = claim.subclaims
              .reduce((acc, { reserve }) => acc + reserve.amount, 0)
              .toString()
            const firstSubclaimWithReserves = claim.subclaims.find(
              ({ reserves }) => !!reserves.length,
            )
            const hasReserves = !!firstSubclaimWithReserves
            const reserveCurrency = firstSubclaimWithReserves?.reserve.currency

            return (
              <TableRow
                index={index}
                length={claims.length}
                onResolve={(selectedIndex) =>
                  redirectClaimHandler(claims[selectedIndex].id)
                }
                key={claim.id}
                onKeyDown={(e) => {
                  if (isPressing(e, Keys.Enter)) {
                    e.preventDefault()
                    router.push(`/claims/${claim.id}`)
                  }
                }}
                onClick={() => redirectClaimHandler(claim.id)}
              >
                <TableColumn style={{ textAlign: 'right', paddingRight: 0 }}>
                  {MarketFlags[claim.market as Market]}
                </TableColumn>

                <TableColumn style={{ position: 'relative' }}>
                  <FlexVertically style={{ paddingLeft: '7px' }}>
                    {claim.member.firstName} {claim.member.lastName}{' '}
                    <TableColumnSubtext>
                      {claim.member.memberId}
                    </TableColumnSubtext>
                  </FlexVertically>
                </TableColumn>

                <TableColumn>
                  <FlexVertically>
                    {openedDateString}
                    <TableColumnSubtext>
                      {openedDateTimeString}
                    </TableColumnSubtext>
                  </FlexVertically>
                  {!!claim.assignedAdmin && (
                    <InfoTag
                      style={{ marginTop: '0.5rem', width: 'max-content' }}
                      status="highlight"
                    >
                      {claim.assignedAdmin.name}
                    </InfoTag>
                  )}
                </TableColumn>

                <TableColumn>
                  <FlexVertically>
                    {claim.subclaims[0]?.type ? (
                      convertEnumToTitle(claim.subclaims[0].type)
                    ) : (
                      <Placeholder>Type not specified</Placeholder>
                    )}
                    <TableColumnSubtext>
                      {claim.subclaims[0]?.outcome ? (
                        convertEnumToTitle(claim.subclaims[0].outcome)
                      ) : (
                        <Placeholder>Outcome not specified</Placeholder>
                      )}
                    </TableColumnSubtext>
                  </FlexVertically>
                </TableColumn>

                <TableColumn>
                  <ClaimStateBadge state={claim.state}>
                    {convertEnumToTitle(claim.state)}
                  </ClaimStateBadge>
                </TableColumn>

                <TableColumn>
                  {hasPayments ? (
                    <Monetary
                      amount={{
                        amount: totalPaymentAmount,
                        currency: paymentCurrency!,
                      }}
                    />
                  ) : (
                    <Placeholder>No payments made</Placeholder>
                  )}
                </TableColumn>

                <TableColumn>
                  {hasReserves ? (
                    <Monetary
                      amount={{
                        amount: totalReserves,
                        currency: reserveCurrency!,
                      }}
                    />
                  ) : (
                    <Placeholder>⚠️ Not specified</Placeholder>
                  )}
                </TableColumn>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePageSelect
        rowCount={claims.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onSelect={(newPage) => router.push(`/claims/list/${newPage}`)}
      />
    </>
  )
}
