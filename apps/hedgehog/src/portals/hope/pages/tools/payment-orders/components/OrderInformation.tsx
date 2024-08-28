import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { convertEnumToTitle, Flex, Label, Popover } from '@hedvig-ui'
import {
  PaymentOrderOrigin,
  PaymentOrderState,
} from '@hope/features/config/constants'
import copy from 'copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Styled } from '../'
import { InfoCircle } from 'react-bootstrap-icons'

export const OrderInformation = ({
  order,
  standalone,
}: {
  order: PaymentOrderInformationFragment
  standalone: boolean
}) => {
  return (
    <>
      <div>
        <Label>Order</Label>
        {standalone ? (
          <Popover contents="Copy order id">
            <Styled.InfoText
              onClick={() => {
                copy(order.id)
                toast.success('Order id copied')
              }}
            >
              {order.id}
            </Styled.InfoText>
          </Popover>
        ) : (
          <Popover contents="Go to order page">
            <Link to={`/tools/payment-orders/${order.id}`} target="_blank">
              <Styled.InfoText>{order.id}</Styled.InfoText>
            </Link>
          </Popover>
        )}
      </div>
      <div>
        <Label>Origin</Label>
        <Styled.InfoTag
          status={
            order.origin === PaymentOrderOrigin.Admin ? 'neutral' : 'highlight'
          }
        >
          {convertEnumToTitle(order.origin)}
        </Styled.InfoTag>
      </div>
      <div>
        <Label>State</Label>
        <Styled.InfoTag
          status={
            order.state === PaymentOrderState.Requested
              ? 'neutral'
              : order.state === PaymentOrderState.Approved
                ? 'warning'
                : order.state === PaymentOrderState.Settled
                  ? 'success'
                  : 'danger'
          }
        >
          {convertEnumToTitle(order.state)}
        </Styled.InfoTag>
      </div>
      {!!order.correctedByOrderId && (
        <div>
          <Label>Correction</Label>
          <Popover contents={`Go to order ${order.correctedByOrderId}`}>
            <Link
              target="_blank"
              to={`/tools/payment-orders/${order.correctedByOrderId}`}
            >
              <Styled.InfoTag status="info">
                <Flex gap="tiny" align="center">
                  <InfoCircle />
                  This order has been corrected
                </Flex>
              </Styled.InfoTag>
            </Link>
          </Popover>
        </div>
      )}
      {!!order.correctsOrderId && (
        <div>
          <Label>Correction</Label>
          <Popover contents={`Go to order ${order.correctsOrderId}`}>
            <Link
              target="_blank"
              to={`/tools/payment-orders/${order.correctsOrderId}`}
            >
              <Styled.InfoTag status="info">
                <Flex gap="tiny" align="center">
                  <InfoCircle />
                  This order corrects another payment
                </Flex>
              </Styled.InfoTag>
            </Link>
          </Popover>
        </div>
      )}
    </>
  )
}
