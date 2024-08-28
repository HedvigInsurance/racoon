import { FC, useState } from 'react'
import styled from '@emotion/styled'
import {
  capitalize,
  Capitalized,
  convertEnumToTitle,
  Flex,
  formatDistanceWithAccuracy,
  InfoTag,
  InfoTagStatus,
  Label,
  Monetary,
  Paragraph,
  Popover,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import {
  CostCategory,
  PaymentMethod,
  PaymentOrderOrigin,
  PaymentOrderState,
} from '@hope/features/config/constants'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { Trash } from 'react-bootstrap-icons'

const TablesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`

const TableWrapper = styled.div`
  width: 100%;
`

const ScrollX = styled.div`
  margin-bottom: 1em;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

const NoPaymentsMessage = styled(StandaloneMessage)`
  padding: 3em 0;
`

const Tag = styled(InfoTag)`
  font-weight: bold;
  text-align: center;
  padding: 0.25rem 0.5rem;
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
`

const PaymentRow = styled(TableRow)`
  font-size: ${({ theme }) => theme.fontSize.small};

  & td {
    ${({ active, theme }) =>
      active && `background-color: ${theme.accentLight} !important;`}
  }
`
const PaymentTableFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const PaymentTotalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 1em;
`

const TotalAmount = styled.div`
  display: flex;
  flex-direction: column;
`

const TotalDeductible = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2em;
`

export const SubclaimPaymentOrderTables: FC<{
  subclaimId: string
}> = ({ subclaimId }) => {
  const { getSubclaim, isPotentiallySanctioned } = useClaim()
  const paymentOrders = getSubclaim(subclaimId)?.paymentOrders

  if (!paymentOrders?.length) {
    return <NoPaymentsMessage>No payments have been made</NoPaymentsMessage>
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
    <TablesWrapper>
      {Object.keys(paymentOrdersPerState)
        .filter((state) => paymentOrdersPerState[state].length > 0)
        .map((state) => (
          <SubclaimPaymentOrdersTable
            key={state}
            isPotentiallySanctioned={isPotentiallySanctioned}
            state={state as PaymentOrderState}
            paymentOrders={paymentOrdersPerState[state]}
          />
        ))}
    </TablesWrapper>
  )
}

const SubclaimPaymentOrdersTable: FC<{
  state: PaymentOrderState
  isPotentiallySanctioned: boolean
  paymentOrders: PaymentOrderInformationFragment[]
}> = ({ state, isPotentiallySanctioned, paymentOrders }) => {
  const [confirming, setConfirming] = useState('')
  const [hovering, setHovering] = useState<string | null>(null)
  const totalAmount = paymentOrders
    .map((payment) => +payment?.amount?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  const totalDeductible = paymentOrders
    .map((payment) => +payment?.deductible?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  const nextState =
    state === 'REQUESTED'
      ? 'APPROVED'
      : state === 'APPROVED'
        ? 'SETTLED'
        : undefined

  const tagStatus = (state: string): InfoTagStatus =>
    state === 'SETTLED'
      ? 'success'
      : state === 'APPROVED'
        ? 'warning'
        : state === 'DISMISSED'
          ? 'danger'
          : 'info'

  const {
    settlePaymentOrder,
    approvePaymentOrder,
    getTransitionUser,
    dismissPaymentOrder,
  } = usePaymentOrder()

  const description =
    state === 'SETTLED'
      ? 'Payouts that have been performed and thus settled'
      : state === 'APPROVED'
        ? 'Payouts that have been approved to be performed, needs to be settled\n\nSettling of an autogiro payout will perform the payout automatically, the others must have a manual payout executed before'
        : state === 'DISMISSED'
          ? 'Payouts that have been dismissed from being performed'
          : 'Payouts that have been requested to be performed'

  return (
    <>
      <TableWrapper>
        <ThirdLevelHeadline style={{ width: '10rem' }}>
          <Tag status={tagStatus(state)}>
            <Capitalized>{convertEnumToTitle(state)}</Capitalized>
          </Tag>
        </ThirdLevelHeadline>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{description}</Paragraph>
        <ScrollX>
          <Table>
            <TableHeader>
              <TableHeaderColumn>Origin</TableHeaderColumn>
              <TableHeaderColumn>Amount</TableHeaderColumn>
              <TableHeaderColumn>Deductible</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Ex Gratia</TableHeaderColumn>
              <TableHeaderColumn>Note</TableHeaderColumn>
              <TableHeaderColumn>Method type</TableHeaderColumn>
              <TableHeaderColumn>Cost type</TableHeaderColumn>
              <TableHeaderColumn>Cost category</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              {nextState && <TableHeaderColumn />}
            </TableHeader>
            <TableBody>
              {paymentOrders.map((order) => (
                <PaymentRow
                  key={order.id}
                  onClick={() =>
                    window.open(`/tools/payment-orders/${order.id}`)
                  }
                >
                  <TableColumn>
                    <Popover
                      position="right"
                      contents={`${capitalize(
                        order.state,
                      )} by ${getTransitionUser(
                        order,
                        order.state as PaymentOrderState,
                      )}`}
                    >
                      <Tag
                        status={
                          order.origin === PaymentOrderOrigin.Admin
                            ? 'neutral'
                            : 'highlight'
                        }
                      >
                        {convertEnumToTitle(order.origin)}
                      </Tag>
                    </Popover>
                  </TableColumn>
                  <TableColumn>
                    <Monetary amount={order.amount} />
                  </TableColumn>
                  <TableColumn>
                    <Monetary amount={order.deductible} />
                  </TableColumn>
                  <TableColumn>
                    <FlexVertically>
                      <Popover
                        contents={formatDistanceWithAccuracy(
                          parseISO(order.transitionedAt),
                        )}
                      >
                        {format(parseISO(order.transitionedAt), 'yyyy-MM-dd')}
                      </Popover>
                    </FlexVertically>
                  </TableColumn>
                  <TableColumn>
                    <Flex justify="center">
                      {order.isExGratia ? (
                        <Tag status="warning">Yes</Tag>
                      ) : (
                        <span>No</span>
                      )}
                    </Flex>
                  </TableColumn>
                  <TableColumn>
                    {!!order.notes.length &&
                      [...order.notes].sort((a, b) => a.addedAt - b.addedAt)[0]
                        .text}
                  </TableColumn>
                  <TableColumn>
                    {`${
                      order.method === PaymentMethod.AUTOGIRO
                        ? 'Automatic'
                        : 'Manual'
                    }`}
                  </TableColumn>
                  <TableColumn>
                    {convertEnumToTitle(order.costType)}
                  </TableColumn>
                  <TableColumn>
                    {Object.entries(CostCategory).find(
                      (category) => category[1] === order.costCategory,
                    )?.[0] ?? 'Unknown'}
                  </TableColumn>
                  <TableColumn style={{ width: '7rem' }}>
                    {!nextState ? (
                      <Tag
                        status={tagStatus(state)}
                        style={{ cursor: 'not-allowed' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Capitalized>{state}</Capitalized>
                      </Tag>
                    ) : (
                      <Tag
                        onMouseEnter={() => setHovering(order.id)}
                        onMouseLeave={() => setHovering(null)}
                        status={tagStatus(state)}
                        style={{ cursor: 'pointer' }}
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!nextState) return
                          setConfirming(order.id)
                          if (state === PaymentOrderState.Approved) {
                            settlePaymentOrder(
                              order,
                              isPotentiallySanctioned,
                            ).finally(() => setConfirming(''))
                          } else {
                            approvePaymentOrder(order).finally(() =>
                              setConfirming(''),
                            )
                          }
                        }}
                      >
                        <Capitalized>
                          {hovering === order.id || confirming === order.id
                            ? nextState.slice(0, -1) + '?'
                            : state}
                        </Capitalized>
                      </Tag>
                    )}
                  </TableColumn>
                  {nextState && (
                    <TableColumn>
                      <Popover position="left" contents="Dismiss?">
                        <Trash
                          onClick={() => dismissPaymentOrder(order.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </Popover>
                    </TableColumn>
                  )}
                </PaymentRow>
              ))}
            </TableBody>
          </Table>
        </ScrollX>
        <PaymentTableFooter>
          <PaymentTotalWrapper>
            <TotalAmount>
              <Label>Total amount</Label>
              <Monetary
                amount={{
                  amount: Number(totalAmount).toFixed(2),
                  currency: paymentOrders[0].amount.currency,
                }}
              />
            </TotalAmount>
            <TotalDeductible>
              <Label>Total deductible</Label>
              <Monetary
                amount={{
                  amount: Number(totalDeductible).toFixed(2),
                  currency: paymentOrders[0].amount.currency,
                }}
              />
            </TotalDeductible>
          </PaymentTotalWrapper>
        </PaymentTableFooter>
      </TableWrapper>
    </>
  )
}
