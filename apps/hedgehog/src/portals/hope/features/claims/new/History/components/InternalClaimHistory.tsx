import { convertEnumToSentence } from '@hedvig-ui'
import { useClaim } from '../../../hooks/use-claim'
import {
  Button,
  Card,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
  TableRowStatusWithPopover,
} from '@hedvig-ui/redesign'
import { ClaimState, PaymentOrderState } from '../../../../config/constants'
import { ClaimMemberFragment } from 'types/generated/graphql'
import { ClaimContractType } from './ClaimContractType'
import { ClaimType } from './ClaimType'
import { ClaimDate } from './ClaimDate'
import { ClaimMoneyDisplay } from './ClaimMoneyDisplay'
import { ClaimOutcome } from './ClaimOutcome'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

type Props = {
  onClickClaim: (claimId: string) => void
}

export const InternalClaimHistory = (props: Props) => {
  const { onClickClaim } = props
  const { member, claimId } = useClaim()
  const claims = member.claims
    .filter(({ id }) => claimId !== id)
    .toSorted(
      (a, b) =>
        new Date(b.registrationDate).getTime() -
        new Date(a.registrationDate).getTime(),
    )

  return (
    <Card className={cssUtil.tableCard}>
      <div className={cssUtil.tableCardTitle}>
        History ({claims.length ?? 0})
      </div>
      {!!claims.length && (
        <Table>
          <TableHeader>
            <TableColumn>Type</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Contract</TableColumn>
            <TableColumn>Deductible</TableColumn>
            <TableColumn>Payout</TableColumn>
            <TableColumn>Outcome</TableColumn>
            <TableColumn />
          </TableHeader>
          {claims.map((claim) => {
            // TODO: How should we display multiple subclaims (moment) in the history?
            const subclaim = claim.subclaims.find((subclaim) => !!subclaim.type)
            const claimDate = claim.dateOfOccurrence
              ? new Date(claim.dateOfOccurrence)
              : undefined
            const deductible = getClaimDeductible(claim)
            const payout = getClaimPayouts(claim)

            return (
              <TableRow key={claim.id}>
                <TableRowStatusWithPopover
                  status={CLAIMSTATE_STATUS[claim.state as ClaimState]}
                  popoverContent={convertEnumToSentence(claim.state)}
                />
                <TableColumn>
                  <ClaimType type={subclaim?.type} />
                </TableColumn>
                <TableColumn>
                  <ClaimDate date={claimDate} />
                </TableColumn>
                <TableColumn>
                  <ClaimContractType
                    insuranceType={claim.contract?.insuranceType}
                  />
                </TableColumn>
                <TableColumn>
                  <ClaimMoneyDisplay money={deductible} />
                </TableColumn>
                <TableColumn>
                  <ClaimMoneyDisplay money={payout} />
                </TableColumn>
                <TableColumn>
                  <ClaimOutcome outcome={subclaim?.outcome} />
                </TableColumn>
                <TableColumn>
                  <Button
                    variant="secondary"
                    onClick={() => onClickClaim(claim.id)}
                  >
                    View
                  </Button>
                </TableColumn>
              </TableRow>
            )
          })}
        </Table>
      )}
    </Card>
  )
}

function getClaimDeductible(claim: ClaimMemberFragment['claims'][number]) {
  return claim.subclaims
    .flatMap((subclaim) => subclaim.paymentOrders)
    .reduce(
      (acc, paymentOrder) => {
        if (!acc.currency) {
          acc.currency = paymentOrder.deductible.currency
        }
        acc.amount += paymentOrder.deductible.amount
        return acc
      },
      { currency: '', amount: 0 },
    )
}
function getClaimPayouts(claim: ClaimMemberFragment['claims'][number]) {
  return claim.subclaims
    .flatMap((subclaim) => subclaim.paymentOrders)
    .filter((paymentOrder) => paymentOrder.state === PaymentOrderState.Settled)
    .reduce(
      (acc, paymentOrder) => {
        if (!acc.currency) {
          acc.currency = paymentOrder.amount.currency
        }
        acc.amount += paymentOrder.amount.amount
        return acc
      },
      { currency: '', amount: 0 },
    )
}

const CLAIMSTATE_STATUS = {
  [ClaimState.Open]: 'success',
  [ClaimState.Reopened]: 'warning',
  [ClaimState.Closed]: 'danger',
} as const
