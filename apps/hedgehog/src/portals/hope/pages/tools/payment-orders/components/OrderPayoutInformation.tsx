import {
  PaymentOrderInformationFragment,
  PaymentOrderSettleAction,
} from 'types/generated/graphql'
import { convertEnumToTitle, Label, Monetary, Popover } from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import { Styled } from '../'

export const OrderPayoutInformation = ({
  order,
}: {
  order: PaymentOrderInformationFragment
}) => {
  return (
    <>
      <div>
        <Label>Recipient</Label>
        <Popover contents="Copy recipient">
          <Styled.InfoText
            onClick={() => {
              copy(convertEnumToTitle(order.recipientName))
              toast.success('Recipient copied')
            }}
          >
            {order.recipientName}
          </Styled.InfoText>
        </Popover>
      </div>
      <div>
        <Label>Type</Label>
        {convertEnumToTitle(order.recipientType)}
      </div>

      {order.bankName && (
        <div>
          <Label>Bank name</Label>
          <Popover contents="Copy bank name">
            <Styled.InfoText
              onClick={() => {
                if (order.bankName == null) {
                  return
                }
                copy(convertEnumToTitle(order.bankName))
                toast.success('Bank name copied')
              }}
            >
              {convertEnumToTitle(order.bankName)}
            </Styled.InfoText>
          </Popover>
        </div>
      )}
      <div>
        {order.number ? (
          <>
            <Label>{convertEnumToTitle(order.method)}</Label>
            <Popover
              contents={`Copy ${convertEnumToTitle(order.method)} number`}
            >
              <Styled.InfoText
                onClick={() => {
                  if (order.number == null) {
                    return
                  }
                  copy(order.number)
                  toast.success(
                    `${convertEnumToTitle(order.method)} number copied`,
                  )
                }}
              >
                {order.number}
              </Styled.InfoText>
            </Popover>
          </>
        ) : (
          <>
            <Label>Method</Label>
            {convertEnumToTitle(order.method)}
          </>
        )}
      </div>
      {order.reference && (
        <div>
          <Label>Reference</Label>
          <Popover contents={`Copy reference`}>
            <Styled.InfoText
              onClick={() => {
                if (order.reference == null) {
                  return
                }
                copy(order.reference)
                toast.success(`Reference copied`)
              }}
            >
              {order.reference}
            </Styled.InfoText>
          </Popover>
        </div>
      )}

      <div>
        <Label>Payout type</Label>
        {convertEnumToTitle(order.costType)}
      </div>

      <div>
        <Label>Cost category</Label>
        {convertEnumToTitle(order.costCategory)}
      </div>

      {order.dueDate && (
        <div>
          <Label>Due date</Label>
          {format(parseISO(order.dueDate), 'yyyy-MM-dd')}
        </div>
      )}

      <div>
        <Label>Amount</Label>
        <Popover contents="Copy amount">
          <Styled.InfoText
            onClick={() => {
              copy(`${order.amount.amount}`)
              toast.success('Amount copied')
            }}
          >
            <Monetary amount={order.amount} />
          </Styled.InfoText>
        </Popover>
      </div>
      <div>
        <Label>Deductible</Label>
        <Popover contents="Copy deductible">
          <Styled.InfoText
            onClick={() => {
              copy(`${order.deductible.amount}`)
              toast.success('Deductible copied')
            }}
          >
            <Monetary amount={order.deductible} />
          </Styled.InfoText>
        </Popover>
      </div>
      <div>
        <Label>Settlement Action</Label>
        {order?.settleAction === PaymentOrderSettleAction.CloseClaimOnSettlement
          ? 'Close Claim'
          : 'Keep Claim Open'}
      </div>
    </>
  )
}
