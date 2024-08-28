import {
  Card,
  FadeIn,
  Flex,
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import {
  OrderClaimInformation,
  OrderEventsInformation,
  OrderInformation,
  OrderNotesInformation,
  OrderPayoutInformation,
  OrderStateActions,
  Styled,
} from '@hope/pages/tools/payment-orders'
import { useSinglePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import {
  PaymentOrderInformationFragment,
  SanctionStatus,
} from 'types/generated/graphql'
import { useParams } from 'react-router-dom'
import { PaymentOrderForm } from '@hope/features/claims/claim-details/SubclaimPaymentOrders'
import { Carrier, Market } from '@hope/features/config/constants'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 1rem;
  padding: 2rem;
`

export default function SingleOrderPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { order, loading } = useSinglePaymentOrder(orderId ?? '')

  if (loading) {
    return <LoadingMessage />
  }

  if (!order) {
    return <StandaloneMessage>Payment order not found</StandaloneMessage>
  }

  return (
    <FadeIn style={{ marginBottom: '1rem' }}>
      <Wrapper>
        <div>
          <Card>
            <ThirdLevelHeadline>Order information</ThirdLevelHeadline>
            <Styled.Row>
              <OrderInformation order={order} standalone={true} />
            </Styled.Row>
          </Card>
          <Card>
            <ThirdLevelHeadline>Claim information</ThirdLevelHeadline>
            <Styled.Row columns={1}>
              <OrderClaimInformation order={order} />
            </Styled.Row>
          </Card>
          <Card>
            <ThirdLevelHeadline>Notes</ThirdLevelHeadline>
            <Styled.ListContainer>
              <OrderNotesInformation order={order} />
            </Styled.ListContainer>
          </Card>
          <Card>
            <ThirdLevelHeadline>Events</ThirdLevelHeadline>
            <Styled.ListContainer>
              <OrderEventsInformation order={order} />
            </Styled.ListContainer>
          </Card>
        </div>
        <div>
          <Card>
            <ThirdLevelHeadline>Payout information</ThirdLevelHeadline>
            <Styled.Row columns={4}>
              <OrderPayoutInformation order={order} />
            </Styled.Row>
            <Spacing top="small" style={{ marginTop: 'auto' }} />
            <Flex gap="small">
              <OrderStateActions order={order} />
            </Flex>
          </Card>
          {(order.state == 'REQUESTED' || order.state === 'APPROVED') && (
            <Card>
              <ThirdLevelHeadline>Edit payment order</ThirdLevelHeadline>
              <EditSection order={order} />
            </Card>
          )}
        </div>
      </Wrapper>
    </FadeIn>
  )
}

const EditSection = ({ order }: { order: PaymentOrderInformationFragment }) => {
  const isPaymentActivated =
    order.member?.contractMarketInfo?.market !== Market.Sweden
      ? false
      : !!order.member?.directDebitStatus?.activated ||
        !!order.member?.payoutMethodStatus?.activated
  const isPotentiallySanctioned =
    order.member?.sanctionStatus === SanctionStatus.Undetermined ||
    order.member?.sanctionStatus === SanctionStatus.PartialHit
  const props = {
    subclaimId: order.subclaim.id,
    memberId: order.member.memberId,
    memberFullName: `${order.member.firstName} ${order.member.lastName}`,
    preferredCurrency: order.amount.currency,
    isPaymentActivated,
    isPotentiallySanctioned,
    defaultDeductible: order.deductible.amount,
    carrier: order.carrier as Carrier,
    recoveriesPresent: !!order.subclaim?.recoveries?.length,
  }

  return <PaymentOrderForm editOrder={true} order={order} {...props} />
}
