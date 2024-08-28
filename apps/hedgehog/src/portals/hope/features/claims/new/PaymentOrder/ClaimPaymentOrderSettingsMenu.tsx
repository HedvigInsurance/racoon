import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { PopupMenuItem } from '@hedvig-ui/redesign'
import { usePaymentOrder } from '../../../paymentOrders/hooks/use-payment-orders'
import { PaymentOrderState } from '../../../config/constants'
import { useClaim } from '../../hooks/use-claim'

export const ClaimPaymentOrderSettingsMenu = (props: {
  order: PaymentOrderInformationFragment
}) => {
  const { order } = props

  const { isPotentiallySanctioned } = useClaim()
  const { approvePaymentOrder, settlePaymentOrder, dismissPaymentOrder } =
    usePaymentOrder()

  const handleGoToOrderClicked = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`/tools/payment-orders/${order.id}`)
  }

  const handleApproveClicked = (e: React.MouseEvent) => {
    e.stopPropagation()
    approvePaymentOrder(order)
  }
  const handleSettleClicked = (e: React.MouseEvent) => {
    e.stopPropagation()
    settlePaymentOrder(order, isPotentiallySanctioned)
  }
  const handleDismissClicked = (e: React.MouseEvent) => {
    e.stopPropagation()
    dismissPaymentOrder(order.id)
  }

  const canApprove = order.state === PaymentOrderState.Requested
  const canSettle = order.state === PaymentOrderState.Approved

  const canDismiss = canApprove || canSettle

  return (
    <>
      <PopupMenuItem onClick={handleGoToOrderClicked}>
        Go to order
      </PopupMenuItem>

      {canApprove && (
        <PopupMenuItem onClick={handleApproveClicked}>Approve</PopupMenuItem>
      )}
      {canSettle && (
        <PopupMenuItem onClick={handleSettleClicked}>Settle</PopupMenuItem>
      )}
      {canDismiss && (
        <PopupMenuItem onClick={handleDismissClicked}>Dismiss</PopupMenuItem>
      )}
    </>
  )
}
