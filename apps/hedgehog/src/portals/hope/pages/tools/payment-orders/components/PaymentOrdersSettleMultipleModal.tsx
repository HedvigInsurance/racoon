/* eslint-disable prettier/prettier */
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { XCircle, CheckCircle, LockFill, UnlockFill } from 'react-bootstrap-icons'
import {
  Modal,
  Flex,
  convertEnumToTitle,
  Popover,
  Spinner,
  Button,
  extractErrorMessage,
  MainHeadline,
  List,
  ListItem,
} from '@hedvig-ui'
import { PaymentRecipientType } from '@hope/features/config/constants'
import {
  PaymentOrderInformationFragment,
  PaymentOrderSettleAction,
  useSettlePaymentOrderMutation,
} from 'types/generated/graphql'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { Divider } from '../styled'
import { settlePaymentsListItem, settlePaymentsListItemTitle } from './PaymentOrdersSettleMultipleModal.css'
import { theme } from '@hedvig-ui/redesign/theme'
import { LegacyTooltip } from '@hedvig-ui/redesign'

const Section = styled.section`
  width: 100%;
`

type TOrderSettleState = 'success' | 'error' | 'loading' | undefined

export const PaymentOrdersSettleMultipleModal = ({
  orders,
  visible,
  onClose,
}: {
  orders: PaymentOrderInformationFragment[]
  visible: boolean
  onClose: () => void
}) => {
  const theme = useTheme()
  const [settleOrder] = useSettlePaymentOrderMutation()
  const { adjustReserve } = usePaymentOrder()
  const [orderStates, setOrderStates] = useState<
    Record<string, TOrderSettleState>
  >(
    orders.reduce(
      (acc, { id }) => {
        acc[id] = undefined
        return acc
      },
      {} as Record<string, TOrderSettleState>,
    ),
  )

  const [orderMessages, setOrderMessages] = useState<Record<string, string>>({})

  const setOrderMessage = (orderId: string, message: string) => {
    setOrderMessages((prev) => {
      const newOrderMessages = { ...prev }
      newOrderMessages[orderId] = message
      return newOrderMessages
    })
  }

  useEffect(() => {
    if (orders.length === Object.keys(orderStates).length) {
      return
    }
    setOrderStates((prev) => {
      const newOrderStates = { ...prev }

      orders.forEach(({ id }) => {
        if (!(id in newOrderStates)) {
          newOrderStates[id] = undefined
        }
      })

      Object.keys(orderStates).forEach((key) => {
        if (!orders.find(({ id }) => id === key)) {
          delete newOrderStates[key]
        }
      })

      return newOrderStates
    })
  }, [orders, orderStates])

  const setOrderState = (id: string, state: TOrderSettleState) => {
    setOrderStates((prev) => {
      const newOrderStates = { ...prev }
      newOrderStates[id] = state
      return newOrderStates
    })
  }

  const isSettled = (orderId: string) => {
    return orderStates[orderId] === 'success'
  }

  const settleSingle = (id: string) => {
    setOrderState(id, 'loading')
    settleOrder({
      variables: { id },
    })
      .then((res) => {
        setOrderState(id, 'success')
        if (!res.data) return
        adjustReserve(res.data.paymentOrder_settle, false)
          .then(() => setOrderMessage(id, 'Settled - Reserve adjusted'))
          .catch(({ message }) => {
            setOrderMessage(id, extractErrorMessage(message))
          })
      })
      .catch(({ message }) => {
        setOrderState(id, 'error')
        setOrderMessage(id, message)
      })
  }

  const nonSettledOrders = orders.filter(({ id }) => !isSettled(id))
  const settleNonSettled = () => {
    nonSettledOrders.forEach(async ({ id }) => {
      settleSingle(id)
    })
  }

  const settledOrders = orders.filter(({ id }) => isSettled(id))

  return (
    <Modal
      style={{ padding: '1rem' }}
      visible={visible}
      onClose={() => {
        onClose()
      }}
    >
      <Flex direction="column" gap="small">
        {!!nonSettledOrders.length && (
          <Section>
            <MainHeadline>Settle payment orders</MainHeadline>
            <Divider style={{ paddingBottom: '1rem', marginTop: '0.5rem' }} />
            <List
              id="settle-payment-orders-list"
              style={{
                overflowY: 'scroll',
                overflowX: 'hidden',
                maxHeight: '70vh'
              }}
            >
              {nonSettledOrders.map((order) => (
                <SettlePaymentListItem
                  key={order.id}
                  order={order}
                  settleState={orderStates[order.id]}
                  settleMessage={orderMessages[order.id]}
                  settle={() => settleSingle(order.id)}
                />
              ))}
            </List>

            <Button
              size="medium"
              style={{ marginTop: theme.spacing.large }}
              onClick={settleNonSettled}
              disabled={Object.values(orderStates).includes('loading')}
            >
              Settle
            </Button>
          </Section>
        )}

        {!!settledOrders.length && (
          <Section>
            <MainHeadline>Settled Orders</MainHeadline>
            <Divider style={{ paddingBottom: '1rem', marginTop: '0.5rem' }} />
            <Flex
              direction="column"
              gap="tiny"
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingBottom: '0.5rem',
              }}
            >
              {settledOrders.map((order) => (
                <SettlePaymentListItem
                  key={order.id}
                  order={order}
                  settleState={'success'}
                  settleMessage={orderMessages[order.id]}
                />
              ))}
            </Flex>
          </Section>
        )}
      </Flex>
    </Modal>
  )
}

const SettlePaymentListItem = ({
  order,
  settleState,
  settleMessage,
  settle,
}: {
  order: PaymentOrderInformationFragment
  settleState: TOrderSettleState
  settleMessage?: string
  settle?: () => void
}) => {

  

  const title = (
    <>
      {order?.settleAction === PaymentOrderSettleAction.CloseClaimOnSettlement ? (
        <LegacyTooltip content="Claim will close on settlement">
          <LockFill style={{ marginRight: theme.space.sm, color: theme.colors.signalGreenText }} />
        </LegacyTooltip>
      ) : (
        <LegacyTooltip content="Claim will be kept open on settlement">
          <UnlockFill style={{ marginRight: theme.space.sm, color: theme.colors.textSecondary }} />
        </LegacyTooltip>
      )}
      {order.amount.amount + ' ' + order.amount.currency + ' to '}
      <span>
        {order.recipientType === PaymentRecipientType.INDIVIDUAL ? (
          <Popover contents="Open in new tab">
            <Link to={`/members/${order.member.memberId}`} target="_blank">
              {order.recipientName}
            </Link>
          </Popover>
        ) : (
          order.recipientName
        )}
        's
      </span>{' '}
      {convertEnumToTitle(order.method)}
      {!!order.subclaim.type && (
        <span>
          {' '}
          for{' '}
          <Popover contents="Open in new tab">
            <Link
              to={`/claims/${order.claimId}?subclaimId=${order.subclaim.id}`}
              target="_blank"
            >
              {convertEnumToTitle(order.subclaim.type)}
            </Link>
          </Popover>
        </span>
      )}
    </>
  )

  const statusSymbol = () => {
    switch (settleState) {
      case 'error':
        return (
          <Popover
            contents={
              settleMessage
                ? `${settleMessage}, click to retry`
                : 'Click to retry'
            }
            position="left"
          >
            <XCircle
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                settle?.()
              }}
              stroke={theme.colors.signalRedElement}
            />
          </Popover>
        )
      case 'loading':
        return <Spinner />
      case 'success':
        return (
          <Popover
            contents={settleMessage ? `${settleMessage}` : 'Settled'}
            position="left"
          >
            <CheckCircle stroke={theme.colors.signalGreenElement} />
          </Popover>
        )
      default:
        return <Spinner style={{ opacity: 0 }} />
    }
  }

  return (
    <ListItem
      className={settlePaymentsListItem}
      style={{
        padding: `${theme.space.sm} 0`,
      }}
    >
      <div className={settlePaymentsListItemTitle}>{title}</div>
      <span>{statusSymbol()}</span>
    </ListItem>
  )
}
