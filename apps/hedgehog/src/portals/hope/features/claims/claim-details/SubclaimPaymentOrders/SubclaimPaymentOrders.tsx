import {
  Card,
  CardContent,
  CardTitle,
  Flex,
  StandaloneMessage,
} from '@hedvig-ui'
import {
  SubclaimPaymentOrderForm,
  SubclaimPaymentOrderTables,
} from '@hope/features/claims/claim-details/SubclaimPaymentOrders'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { ClaimState } from '@hope/features/config/constants'
import { NoCarrierPaymentPlaceholder } from '../ClaimSubclaims/components/NoCarrierPlaceholder'

export const SubclaimPaymentOrders = ({
  subclaimId,
}: {
  subclaimId: string
}) => {
  const { claimState, preferredCurrency, agreement } = useClaim()
  const carrier = agreement?.carrier
  const claimIsClosed = claimState === ClaimState.Closed

  return (
    <Flex direction="column" gap="medium">
      <CardTitle title="Payment Orders" />
      <SubclaimPaymentOrderTables subclaimId={subclaimId} />
      {!claimIsClosed && !!preferredCurrency && !!carrier ? (
        <Card>
          <CardTitle title="Add new payment order" />
          <CardContent>
            <SubclaimPaymentOrderForm subclaimId={subclaimId} />
          </CardContent>
        </Card>
      ) : claimIsClosed ? (
        <StandaloneMessage>
          Cannot add payment orders when claim is closed
        </StandaloneMessage>
      ) : !preferredCurrency ? (
        <StandaloneMessage>
          Could not find the member's preferred currency for payments
        </StandaloneMessage>
      ) : (
        <NoCarrierPaymentPlaceholder />
      )}
    </Flex>
  )
}
