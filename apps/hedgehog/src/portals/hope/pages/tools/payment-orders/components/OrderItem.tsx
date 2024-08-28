import * as React from 'react'
import {
  Button,
  convertEnumToTitle,
  Flex,
  formatDistanceWithAccuracy,
  Monetary,
  Placeholder,
  Popover,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import { CashCoin, CheckCircle, Trash } from 'react-bootstrap-icons'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import {
  Currency,
  CurrencyFlags,
  PaymentMethod,
  PaymentOrderState,
} from '@hope/features/config/constants'
import copy from 'copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { css } from '@emotion/react'
import { format, parseISO } from 'date-fns'
import { getCarrierText } from '@hope/features/contracts/utils'

const ListCell = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const CellSubText = styled.div<{ canHover?: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSize.small} !important;

  color: ${({ theme }) => theme.semiStrongForeground};

  ${({ canHover, theme }) =>
    canHover &&
    css`
      &:hover {
        color: ${theme.accentLight};
      }
    `}
`

const Info = styled.span`
  color: ${({ theme }) => theme.accent};
  cursor: pointer;
  transition: all 200ms ease !important;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    color: ${({ theme }) => theme.accentLight};
  }
`

export const OrderItem: React.FC<{
  warning: boolean
  index: number
  order: PaymentOrderInformationFragment
}> = ({ warning, index, order }) => {
  const { approvePaymentOrder, settlePaymentOrder, dismissPaymentOrder } =
    usePaymentOrder()

  const copyTextAndConfirm = (
    text: string | null | undefined,
    confirmText: string,
  ) => {
    if (!text) return
    copy(text)
    toast.success(`${confirmText} copied`)
  }

  return (
    <>
      <Flex justify="center">
        {CurrencyFlags[order.amount.currency as Currency]}
      </Flex>

      <ListCell>
        <Link target="_blank" to={`/claims/${order.claimId}`}>
          {warning ? `⚠️ ${order.claimId}` : order.claimId}
          <br />
          <CellSubText>{getCarrierText(order.carrier)}</CellSubText>
        </Link>
      </ListCell>

      <Flex>
        <Popover
          position="right"
          contents={formatDistanceWithAccuracy(parseISO(order.transitionedAt))}
        >
          {format(parseISO(order.transitionedAt), 'yyyy-MM-dd HH:mm')}
        </Popover>
      </Flex>

      <ListCell>{convertEnumToTitle(order.costType)}</ListCell>

      <ListCell>{convertEnumToTitle(order.costCategory)}</ListCell>

      <ListCell>
        <Info
          onClick={(e) => {
            e.stopPropagation()
            copyTextAndConfirm(order.recipientName, 'Recipient name')
          }}
        >
          {order.recipientName}
        </Info>
        <CellSubText>{convertEnumToTitle(order.recipientType)}</CellSubText>
      </ListCell>

      <ListCell>
        <Info
          onClick={(e) => {
            e.stopPropagation()
            copyTextAndConfirm(`${order.amount.amount}`, 'Amount')
          }}
        >
          <Monetary amount={order.amount} />
        </Info>
      </ListCell>

      <ListCell>
        {order.bic && order.bankName && (
          <>
            <Info
              onClick={(e) => {
                e.stopPropagation()
                copyTextAndConfirm(order.bankName, 'Bank name')
              }}
            >
              {order.bankName}
            </Info>
            <CellSubText
              canHover={true}
              onClick={(e) => {
                e.stopPropagation()
                copyTextAndConfirm(order.bic, 'BIC number')
              }}
            >
              {convertEnumToTitle(order.bic)}
            </CellSubText>
          </>
        )}

        {order.bic && !order.bankName && (
          <Info
            onClick={(e) => {
              e.stopPropagation()
              copyTextAndConfirm(order.bic, 'BIC number')
            }}
          >
            {order.bic}
          </Info>
        )}

        {order.bankName && !order.bic && (
          <Info
            onClick={(e) => {
              e.stopPropagation()
              copyTextAndConfirm(order.bankName, 'Bank name')
            }}
          >
            {convertEnumToTitle(order.bankName)}
          </Info>
        )}

        {!order.bic && !order.bankName && (
          <Placeholder>Not specified</Placeholder>
        )}
      </ListCell>

      <ListCell>
        {order.number ? (
          <>
            <Info
              onClick={(e) => {
                e.stopPropagation()
                copyTextAndConfirm(
                  order.number,
                  `${convertEnumToTitle(order.method)} number`,
                )
              }}
            >
              {order.number}
            </Info>
            <CellSubText>{convertEnumToTitle(order.method)}</CellSubText>
          </>
        ) : (
          convertEnumToTitle(order.method)
        )}
      </ListCell>

      <ListCell>
        {order.reference ? (
          <>
            <Info
              onClick={(e) => {
                e.stopPropagation()
                copyTextAndConfirm(order.reference, 'reference')
              }}
            >
              {order.reference}
            </Info>
            <CellSubText>
              {[PaymentMethod.BANKGIRO, PaymentMethod.PLUSGIRO].includes(
                order.method as PaymentMethod,
              )
                ? 'OCR'
                : null}
            </CellSubText>
          </>
        ) : (
          <Placeholder>Not specified</Placeholder>
        )}
      </ListCell>

      {order.state === PaymentOrderState.Requested && (
        <Flex justify="center">
          <Popover contents="Approve" position={index === 0 ? 'left' : 'top'}>
            <Button
              style={{ padding: '0.5rem' }}
              variant="tertiary"
              onClick={() => approvePaymentOrder(order)}
              icon={<CheckCircle />}
            />
          </Popover>
        </Flex>
      )}

      {order.state === PaymentOrderState.Approved && (
        <Flex justify="center">
          <Popover contents="Settle" position={index === 0 ? 'left' : 'top'}>
            <Button
              style={{ padding: '0.5rem' }}
              variant="tertiary"
              onClick={() => settlePaymentOrder(order, false)}
              icon={<CashCoin />}
            />
          </Popover>
        </Flex>
      )}

      {[PaymentOrderState.Requested, PaymentOrderState.Approved].includes(
        order.state as PaymentOrderState,
      ) ? (
        <Flex justify="center">
          <Popover contents="Dismiss" position={index === 0 ? 'left' : 'top'}>
            <Button
              style={{ padding: '0.5rem' }}
              variant="tertiary"
              onClick={() => dismissPaymentOrder(order.id)}
              icon={<Trash />}
            />
          </Popover>
        </Flex>
      ) : (
        <Flex justify="center" style={{ gridColumn: 'span 2' }}>
          {convertEnumToTitle(order.state)}
        </Flex>
      )}
    </>
  )
}
