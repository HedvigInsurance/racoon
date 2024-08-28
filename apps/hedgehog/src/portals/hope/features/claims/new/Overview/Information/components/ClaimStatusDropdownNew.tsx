import * as React from 'react'
import { convertEnumToTitle, useConfirmDialog } from '@hedvig-ui'
import { ClaimState, PaymentOrderState } from '@hope/features/config/constants'
import { useSetClaimStatus } from '@hope/features/claims/hooks/useSetClaimStatus'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { Dropdown, OrbIndicator } from '@hedvig-ui/redesign'

const CLAIM_STATE_STATUS = {
  [ClaimState.Open]: 'success',
  [ClaimState.Closed]: 'danger',
  [ClaimState.Reopened]: 'warning',
} as const

export const ClaimStatusDropdownNew: React.FC = ({ ...props }) => {
  const { subclaims, claimId, claimState: status } = useClaim()
  const { setStatus } = useSetClaimStatus()
  const { dismissPaymentOrder } = usePaymentOrder()
  const pendingPaymentOrders = subclaims.flatMap((subclaim) =>
    subclaim.paymentOrders.filter((order) =>
      [PaymentOrderState.Requested, PaymentOrderState.Approved].includes(
        order.state as PaymentOrderState,
      ),
    ),
  )
  const { confirm } = useConfirmDialog()

  const onOptionClicked = async (state: ClaimState) => {
    if (state === ClaimState.Closed && pendingPaymentOrders?.length) {
      await confirm(
        `This will dismiss all (${pendingPaymentOrders.length}) payment orders that are not yet settled`,
        'danger',
      )
      await Promise.all(
        pendingPaymentOrders.map((order) =>
          dismissPaymentOrder(order.id, 'Dismissed on claim close'),
        ),
      )
    }
    await setStatus(claimId, state)
  }

  return (
    <Dropdown
      label="State"
      options={Object.values(ClaimState).map((state) => ({
        value: state,
        label: convertEnumToTitle(state),
        action: () => onOptionClicked(state),
        selected: status === state,
        icon: <OrbIndicator status={CLAIM_STATE_STATUS[state]} />,
      }))}
      {...props}
    />
  )
}
