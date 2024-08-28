import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { PaymentOrderState } from '@hope/features/config/constants'
import { Capitalized, Flex } from '@hedvig-ui'

export const OrderEventsInformation = ({
  order,
}: {
  order: PaymentOrderInformationFragment
}) => {
  const { getTransitionUser, getTransitionTimestamp } = usePaymentOrder()
  return (
    <>
      {Object.values(PaymentOrderState).map(
        (state) =>
          !!getTransitionUser(order, state) && (
            <Flex direction="column" key={state}>
              <Capitalized style={{ fontSize: '0.875rem' }}>
                {state} by{' '}
              </Capitalized>
              <Flex justify="space-between">
                <div>{getTransitionUser(order, state)}</div>
                <div style={{ fontSize: '0.875rem' }}>
                  {getTransitionTimestamp(order, state)}
                </div>
              </Flex>
            </Flex>
          ),
      )}
    </>
  )
}
