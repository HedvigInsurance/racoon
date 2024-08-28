import { useState } from 'react'
import {
  Collapsible,
  convertEnumToSentence,
  convertEnumToTitle,
  formatMoney,
  StandaloneMessage,
} from '@hedvig-ui'
import {
  Card,
  Div,
  Flex,
  Grid,
  InfoTag,
  LabeledText,
  Table,
  TableColumn,
  TableHeader,
  TableRow,
  TableRowStatus,
  PopupMenu,
  LegacyTooltip,
} from '@hedvig-ui/redesign'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import {
  PaymentOrderInformationFragment,
  SystemUser,
} from 'types/generated/graphql'
import { PaymentOrderState } from '../../../config/constants'
import { formatDate } from 'date-fns/format'
import { ChevronDownIcon, IconButton } from '@hedvig-ui/icons'
import { ThreeDotsVertical } from 'react-bootstrap-icons'
import { ClaimPaymentOrderSettingsMenu } from './ClaimPaymentOrderSettingsMenu'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const ClaimPaymentOrderTablesNew = () => {
  const { subclaims } = useClaim()
  const paymentOrders = subclaims.flatMap((sc) => sc.paymentOrders)

  if (!paymentOrders.length) {
    return <StandaloneMessage>No payments have been made</StandaloneMessage>
  }

  const paymentOrdersPerState: Record<
    string,
    PaymentOrderInformationFragment[]
  > = paymentOrders.reduce(
    (stateOrders, current) => {
      stateOrders[current.state].push(
        current as PaymentOrderInformationFragment,
      )
      return stateOrders
    },
    {
      [PaymentOrderState.Dismissed]: [],
      [PaymentOrderState.Requested]: [],
      [PaymentOrderState.Approved]: [],
      [PaymentOrderState.Settled]: [],
    } as Record<string, PaymentOrderInformationFragment[]>,
  )

  return (
    <Flex direction="column" gap="medium">
      {Object.keys(paymentOrdersPerState)
        .filter((state) => paymentOrdersPerState[state].length > 0)
        .map((state) => (
          <SubclaimPaymentOrdersTable
            key={state}
            state={state as PaymentOrderState}
            paymentOrders={paymentOrdersPerState[state]}
          />
        ))}
    </Flex>
  )
}

const PAYMENT_ORDER_STATE_STATUS = {
  [PaymentOrderState.Settled]: 'success',
  [PaymentOrderState.Approved]: 'warning',
  [PaymentOrderState.Dismissed]: 'danger',
  [PaymentOrderState.Requested]: 'info',
} as const

const SubclaimPaymentOrdersTable = ({
  state,
  paymentOrders,
}: {
  state: PaymentOrderState
  paymentOrders: PaymentOrderInformationFragment[]
}) => {
  const currency = paymentOrders[0].amount.currency
  const { payout, deductible } = paymentOrders.reduce(
    (acc, { amount, deductible }) => {
      acc.payout += amount.amount
      acc.deductible += deductible.amount
      return acc
    },
    { payout: 0, deductible: 0 },
  )
  return (
    <Card style={{ padding: 0 }}>
      <div className={cssUtil.tableCardTitle}>
        <Flex gap="small" align="center">
          {convertEnumToTitle(state)}
          <InfoTag variant="neutral">{paymentOrders.length}</InfoTag>
        </Flex>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>Claim type</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Deductible</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Method</TableColumn>
          <TableColumn />
        </TableHeader>
        {paymentOrders.map((order) => {
          return <PaymentOrderTableRow key={order.id} order={order} />
        })}
      </Table>
      <Flex py="small" px="medium" gap="medium">
        <LabeledText label="Total amount">
          {formatMoney({ amount: payout, currency })}
        </LabeledText>
        <LabeledText label="Total deductible">
          {formatMoney({ amount: deductible, currency })}
        </LabeledText>
      </Flex>
    </Card>
  )
}

const PaymentOrderTableRow = ({
  order,
}: {
  order: PaymentOrderInformationFragment
}) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const handleRowClick = () => {
    setShowExtraInfo((prev) => !prev)
  }

  const toggleShowSettings = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setShowSettings((prev) => !prev)
  }

  return (
    <>
      <TableRow onClick={handleRowClick} className={cssUtil.pointer}>
        <TableRowStatus
          status={PAYMENT_ORDER_STATE_STATUS[order.state as PaymentOrderState]}
        />
        <TableColumn>{convertEnumToSentence(order.subclaim.type!)}</TableColumn>
        <TableColumn>{formatMoney(order.amount)}</TableColumn>
        <TableColumn>{formatMoney(order.deductible)}</TableColumn>
        <TableColumn>{formatDate(order.createdAt, 'yyyy-MM-dd')}</TableColumn>
        <TableColumn>{convertEnumToTitle(order.method)}</TableColumn>
        <TableColumn>
          <Flex justify="flex-end" gap="small" align="center">
            <LegacyTooltip content="Expand">
              <IconButton>
                <ChevronDownIcon
                  className={
                    showExtraInfo ? cssUtil.rotated180 : cssUtil.rotatable
                  }
                />
              </IconButton>
            </LegacyTooltip>

            <PopupMenu
              visible={showSettings}
              onClose={() => setShowSettings(false)}
              target={
                <LegacyTooltip content="More">
                  <IconButton onClick={toggleShowSettings}>
                    <ThreeDotsVertical />
                  </IconButton>
                </LegacyTooltip>
              }
            >
              <ClaimPaymentOrderSettingsMenu order={order} />
            </PopupMenu>
          </Flex>
        </TableColumn>
      </TableRow>

      <Collapsible collapsed={!showExtraInfo}>
        <Grid px="medium" py="small" templateColumns="2fr 1fr">
          <Flex direction="column">
            <Grid equalColumns={2}>
              <LabeledText label="Recipient">{order.recipientName}</LabeledText>

              <LabeledText label="Cost category">
                {convertEnumToTitle(order.costCategory)}
              </LabeledText>

              <LabeledText label="Cost type">
                {convertEnumToTitle(order.costType)}
              </LabeledText>
            </Grid>
          </Flex>
          <Flex direction="column">
            {getOrderTransitions(order).map((transition) => (
              <TransitionInfo key={transition.state} transition={transition} />
            ))}
          </Flex>
        </Grid>
      </Collapsible>
    </>
  )
}

const getOrderTransitions = (order: PaymentOrderInformationFragment) => {
  const transactions = []

  const requestedBy = getTransitionHandler(order.createdByUser)
  if (requestedBy) {
    transactions.push({
      state: convertEnumToTitle(PaymentOrderState.Requested),
      handler: requestedBy,
      timestamp: formatDate(order.createdAt, 'yyyy-MM-dd, HH:mm'),
      note: order.notes.find(({ type }) => type === 'REQUESTED')?.text,
    })
  }

  const editedNote = order.notes.find(({ type }) => type === 'UPDATED')
  const editedBy = editedNote
    ? getTransitionHandler(editedNote.addedByUser)
    : undefined
  if (editedBy) {
    transactions.push({
      state: 'Edited',
      handler: editedBy,
      timestamp: formatDate(editedNote?.addedAt, 'yyyy-MM-dd, HH:mm'),
      note: editedNote?.text,
    })
  }

  const approvedBy = getTransitionHandler(order.approvedByUser)
  if (approvedBy) {
    transactions.push({
      state: convertEnumToTitle(PaymentOrderState.Approved),
      handler: approvedBy,
      timestamp: formatDate(order.approvedAt, 'yyyy-MM-dd, HH:mm'),
      note: undefined,
    })
  }

  const settledBy = getTransitionHandler(order.settledByUser)
  if (settledBy) {
    transactions.push({
      state: convertEnumToTitle(PaymentOrderState.Settled),
      handler: settledBy,
      timestamp: formatDate(order.settledAt, 'yyyy-MM-dd, HH:mm'),
      note: undefined,
    })
  }

  const dismissedBy = getTransitionHandler(order.dismissedByUser)
  if (dismissedBy) {
    transactions.push({
      state: convertEnumToTitle(PaymentOrderState.Dismissed),
      handler: dismissedBy,
      timestamp: formatDate(order.dismissedAt, 'yyyy-MM-dd, HH:mm'),
      note: order.notes.find(({ type }) => type === 'DISMISSED')?.text,
    })
  }

  return transactions.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
}

const getTransitionHandler = (
  user: SystemUser | null | undefined,
): string | undefined => {
  if (!user) {
    return
  }
  if (user.__typename === 'AdminSystemUser') {
    return user.email
  }
  return 'Automation'
}

const TransitionInfo = ({
  transition,
}: {
  transition: ReturnType<typeof getOrderTransitions>[number]
}) => (
  <div>
    <LabeledText
      key={transition.state}
      label={`${transition.state} by ${transition.handler}`}
    >
      {transition.timestamp}
    </LabeledText>
    {transition.note && (
      <Div ml="tiny" style={{ fontSize: '14px' }}>
        <i>{transition.note}</i>
      </Div>
    )}
  </div>
)
