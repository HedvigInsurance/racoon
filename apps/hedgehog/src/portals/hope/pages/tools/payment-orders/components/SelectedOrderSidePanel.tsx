import * as React from 'react'
import { Flex } from '@hedvig-ui'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { Pencil } from 'react-bootstrap-icons'
import {
  OrderClaimInformation,
  OrderEventsInformation,
  OrderInformation,
  OrderNotesInformation,
  OrderPayoutInformation,
  OrderStateActions,
  Styled,
} from '@hope/pages/tools/payment-orders'

export const SelectedOrderSidePanel: React.FC<{
  order: PaymentOrderInformationFragment
}> = ({ order }) => {
  if (!order) {
    return <div>Select an order to handle</div>
  }

  return (
    <Flex direction="column" gap="small" style={{ fontSize: '1rem' }}>
      <strong>Order information</strong>
      <Styled.Row>
        <OrderInformation order={order} standalone={false} />
      </Styled.Row>

      <Styled.Divider />

      <strong>Claim information</strong>
      <Styled.Row columns={1}>
        <OrderClaimInformation order={order} />
      </Styled.Row>

      {order.type === 'PAYOUT' && (
        <>
          <Styled.Divider />
          <strong>Payout information</strong>
          <Styled.Row>
            <OrderPayoutInformation order={order} />
          </Styled.Row>
        </>
      )}

      {(order.state === 'REQUESTED' || order.state === 'APPROVED') && (
        <>
          <Styled.Row columns={1}>
            <Styled.ActionButton
              onClick={() => {
                window.open(`/tools/payment-orders/${order.id}`)
              }}
            >
              Edit payment order
              <Pencil />
            </Styled.ActionButton>
            <Styled.Divider />
          </Styled.Row>
        </>
      )}

      <Styled.Row columns={2}>
        <OrderStateActions order={order} />
      </Styled.Row>

      <Styled.Divider />

      <strong>Notes</strong>
      <OrderNotesInformation order={order} />

      <Styled.Divider />

      <strong>Events</strong>
      <OrderEventsInformation order={order} />
    </Flex>
  )
}
