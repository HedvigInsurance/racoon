import styled from '@emotion/styled'
import { convertEnumToTitle, Flex, Label, Monetary, Spacing } from '@hedvig-ui'
import chroma from 'chroma-js'
import { parseISO } from 'date-fns'
import { formatDate } from 'date-fns/format'
import { HTMLAttributes } from 'react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Claim } from 'types/generated/graphql'
import { useTaskNavigation } from '@hope/features/tasks/hooks/use-task-navigation'
import { ClaimState } from '@hope/features/config/constants'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const ClaimItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  cursor: pointer;
  transition: background-color 200ms;

  padding: 0.5rem;
  margin-bottom: 0.5rem;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent).brighten(1.5).alpha(0.3).hex()};
  }

  width: 100%;
  border-radius: 0.5rem;
  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(0.5).alpha(0.15).hex()};

  padding: 0.75rem;
`

const ClaimItemSection = styled.div`
  :last-of-type {
    grid-column: 4;
    text-align: right;
  }
`

const ClaimItemTitle = styled.div<{ greyOut?: boolean }>`
  margin-bottom: 0.25rem;
  font-size: 1rem;
  color: ${({ theme, greyOut }) =>
    greyOut ? theme.semiStrongForeground : theme.foreground};
`

const ClaimItemSubtitle = styled.div<{ greyOut?: boolean }>`
  font-size: 0.9rem;
  color: ${({ theme, greyOut }) =>
    greyOut ? theme.semiStrongForeground : theme.foreground};
`

const ClaimItem: React.FC<
  { claim: Claim; slim?: boolean } & HTMLAttributes<HTMLAnchorElement>
> = ({ claim, slim, ...props }) => {
  const {
    taskNavigate,
    params: { memberId, claimIds, tab, taskId },
  } = useTaskNavigation()

  if (slim) {
    return (
      <div
        onClick={() => {
          taskNavigate({
            memberId,
            tab,
            claimIds: [...claimIds.filter((id) => id !== claim.id), claim.id],
            active: claim.id,
            taskId,
          })
        }}
      >
        <ClaimItemContent claim={claim} />
      </div>
    )
  }

  return (
    <Link to={`/claims/${claim.id}`} {...props}>
      <ClaimItemContent claim={claim} />
    </Link>
  )
}

const ClaimItemContent: React.FC<{ claim: Claim }> = ({ claim }) => {
  const registrationDateString = formatDate(
    parseISO(claim.openedAt),
    'dd MMMM, yyyy',
  )
  const registrationDateTimeString = formatDate(
    parseISO(claim.openedAt),
    'HH:mm',
  )

  const payments = claim.subclaims.reduce(
    (payments, { paymentOrders }) => {
      const currentSubclaimPayments = paymentOrders
        .filter(({ settledAt }) => Boolean(settledAt))
        .reduce(
          (
            acc,
            {
              amount: { amount, currency },
              deductible: { amount: deductible },
            },
          ) => {
            acc.amount += amount
            acc.deductible += deductible
            acc.currency = currency
            return acc
          },
          { amount: 0, deductible: 0, currency: '' },
        )
      payments.amount += currentSubclaimPayments.amount
      payments.deductible += currentSubclaimPayments.deductible
      payments.currency = currentSubclaimPayments.currency
      return payments
    },
    { amount: 0, deductible: 0, currency: '' },
  )

  const claimType = claim.subclaims[0]?.type
  const outcome = claim.subclaims[0]?.outcome
  const insuranceType = claim.contract?.insuranceType
  const petName = claim.agreement?.name
  const registrationNumner = claim.agreement?.registrationNumber

  return (
    <ClaimItemWrapper>
      <ClaimItemSection>
        <ClaimItemTitle greyOut={!claimType}>
          {claimType ? convertEnumToTitle(claimType) : 'No type'}
        </ClaimItemTitle>
        <Flex direction="column">
          <ClaimItemSubtitle>
            {!!insuranceType && (
              <span>{convertEnumToTitle(insuranceType)}</span>
            )}
            {!!petName && insuranceType ? `, ${petName}` : petName}
            {!!registrationNumner && insuranceType
              ? `, ${registrationNumner}`
              : registrationNumner}
          </ClaimItemSubtitle>
          <ClaimItemSubtitle greyOut={!outcome}>
            {outcome ? convertEnumToTitle(outcome) : 'No outcome'}
          </ClaimItemSubtitle>
        </Flex>
      </ClaimItemSection>

      {!!payments.currency && (
        <>
          <ClaimItemSection>
            <ClaimItemTitle>Payout</ClaimItemTitle>
            <ClaimItemSubtitle>
              <Monetary
                amount={{
                  amount: String(payments.amount),
                  currency: payments.currency,
                }}
              />
            </ClaimItemSubtitle>
          </ClaimItemSection>

          <ClaimItemSection>
            <ClaimItemTitle>Deductible</ClaimItemTitle>
            <ClaimItemSubtitle>
              <Monetary
                amount={{
                  amount: String(payments.deductible),
                  currency: payments.currency,
                }}
              />
            </ClaimItemSubtitle>
          </ClaimItemSection>
        </>
      )}

      <ClaimItemSection>
        <ClaimItemTitle>{registrationDateString}</ClaimItemTitle>
        <ClaimItemSubtitle>{registrationDateTimeString}</ClaimItemSubtitle>
      </ClaimItemSection>
    </ClaimItemWrapper>
  )
}

export const MemberClaimsView: React.FC<{
  slim?: boolean
}> = ({ slim }) => {
  const { claimId, member } = useClaim()

  const currentClaim = (member?.claims ?? []).find(
    (claim) => claim.id === claimId,
  )

  const claims = (member?.claims ?? [])
    .filter(
      (claim) =>
        claim.subclaims[0]?.outcome !== 'DUPLICATE' && claim.id !== claimId,
    )
    .sort((c1, c2) => (c1.openedAt < c2.openedAt ? 1 : -1))

  const openClaims = claims.filter(
    (claim) =>
      claim.state === ClaimState.Open || claim.state === ClaimState.Reopened,
  )

  const closedClaims = claims.filter(
    (claim) => claim.state === ClaimState.Closed || claim.id === claimId,
  )

  return (
    <>
      {currentClaim && (
        <div>
          <Label>This claim</Label>
          <div style={{ marginBottom: '0.25rem' }} />
          <ClaimItem
            slim={slim}
            key={currentClaim?.id}
            claim={currentClaim as Claim}
          />

          <Spacing top="small" />
        </div>
      )}

      {openClaims.length !== 0 && (
        <div>
          <Label>Open</Label>
          <div style={{ marginBottom: '0.25rem' }} />
          {openClaims.map((claim) => (
            <ClaimItem slim={slim} key={claim.id} claim={claim as Claim} />
          ))}
        </div>
      )}

      <Spacing top="small" />

      {closedClaims.length !== 0 && (
        <div>
          <Label>Closed</Label>
          <div style={{ marginBottom: '0.25rem' }} />
          {closedClaims.map((claim) => (
            <ClaimItem slim={slim} key={claim.id} claim={claim as Claim} />
          ))}
        </div>
      )}
    </>
  )
}
