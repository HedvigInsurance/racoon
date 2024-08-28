import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { CashCoin, CheckCircle, Trash } from 'react-bootstrap-icons'
import { Styled } from '@hope/pages/tools/payment-orders'
import { PaymentOrderState } from '@hope/features/config/constants'

export const OrderStateActions = ({
  order,
}: {
  order: PaymentOrderInformationFragment
}) => {
  const {
    createCorrectionOrder,
    settlePaymentOrder,
    dismissPaymentOrder,
    approvePaymentOrder,
  } = usePaymentOrder()

  const canBeCorrected =
    order.state === PaymentOrderState.Settled &&
    !order.correctsOrderId &&
    !order.correctedByOrderId

  return (
    <>
      {order.state === PaymentOrderState.Approved ? (
        <>
          <Styled.ActionButton
            status="success"
            onClick={() => settlePaymentOrder(order, false)}
          >
            Settle
            <CashCoin />
          </Styled.ActionButton>
          <Styled.ActionButton
            status="danger"
            onClick={() => dismissPaymentOrder(order.id)}
          >
            Dismiss
            <Trash />
          </Styled.ActionButton>
        </>
      ) : order.state === PaymentOrderState.Requested ? (
        <>
          <Styled.ActionButton
            status="warning"
            onClick={() => approvePaymentOrder(order)}
          >
            Approve
            <CheckCircle />
          </Styled.ActionButton>
          <Styled.ActionButton
            status="danger"
            onClick={() => dismissPaymentOrder(order.id)}
          >
            Dismiss
            <Trash />
          </Styled.ActionButton>
        </>
      ) : (
        canBeCorrected && (
          <Styled.ActionButton
            onClick={() => createCorrectionOrder(order)}
            variant="secondary"
            style={{ gridColumn: '1 / -1' }}
          >
            Make correction
          </Styled.ActionButton>
        )
      )}
    </>
  )
}
