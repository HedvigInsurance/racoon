import * as React from 'react'
import {
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  useConfirmDialog,
} from '@hedvig-ui'
import { ClaimState, PaymentOrderState } from '@hope/features/config/constants'
import { useSetClaimStatus } from '@hope/features/claims/hooks/useSetClaimStatus'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'

export const ClaimStatusDropdown: React.FC = ({ ...props }) => {
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

  return (
    <Dropdown placeholder="State" {...props}>
      {Object.values(ClaimState).map((state) => (
        <DropdownOption
          key={state}
          onClick={async () => {
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
          }}
          selected={status === state}
        >
          {convertEnumToTitle(state)}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}
