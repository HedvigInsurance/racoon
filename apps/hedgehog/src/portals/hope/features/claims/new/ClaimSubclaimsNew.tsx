import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimSubclaimFragment } from 'types/generated/graphql'
import {
  Card,
  Div,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
  TableRowStatus,
} from '@hedvig-ui/redesign'
import { convertEnumToSentence, Placeholder } from '@hedvig-ui'
import { SubclaimNew } from '@hope/features/claims/new/SubclaimNew'
import { useState } from 'react'
import { AddSubclaimNew } from './AddSubclaimNew'
import { PaymentOrderState } from '../../config/constants'
import { sumOfAmounts } from './helpers'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const ClaimSubclaimsNew = () => {
  const { subclaims } = useClaim()

  const [selectedSubclaim, setSelectedSubclaim] = useState(subclaims[0])

  return (
    <>
      <Card mt="medium" style={{ padding: 0, overflow: 'clip' }}>
        <SubclaimsList subclaims={subclaims} onClicked={setSelectedSubclaim} />
      </Card>
      {selectedSubclaim ? (
        <Div mt="medium">
          <SubclaimNew subclaim={selectedSubclaim} />
        </Div>
      ) : null}
    </>
  )
}

const SubclaimsList = (props: {
  subclaims: ClaimSubclaimFragment[]
  onClicked: (subclaim: ClaimSubclaimFragment) => void
}) => {
  const { subclaims, onClicked } = props
  return (
    <>
      <div className={cssUtil.tableCardTitle}>
        Subclaims ({subclaims.length})
        <AddSubclaimNew onSuccess={() => null} />
      </div>
      <Table>
        <TableHeader>
          <TableColumn>Type</TableColumn>
          <TableColumn>Outcome</TableColumn>
          <TableColumn>Reserves</TableColumn>
          <TableColumn>Total payouts</TableColumn>
        </TableHeader>
        {subclaims.map((subclaim) => {
          return (
            <TableRow
              key={subclaim.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onClicked(subclaim)}
            >
              <TableRowStatus
                status={(subclaim.outcome && 'success') || 'warning'}
              />
              <TableColumn>
                {subclaim.claimType?.displayName ?? (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>
              <TableColumn>
                {subclaim.outcome ? (
                  convertEnumToSentence(subclaim.outcome)
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>
              <TableColumn>{sumOfAmounts(subclaim.reserves)}</TableColumn>
              <TableColumn>
                {sumOfAmounts(
                  subclaim.paymentOrders.filter(
                    ({ state }) => state === PaymentOrderState.Settled,
                  ),
                )}
              </TableColumn>
            </TableRow>
          )
        })}
      </Table>
    </>
  )
}
