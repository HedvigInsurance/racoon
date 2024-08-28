import { Flex } from '@hedvig-ui/redesign'
import { ClaimPaymentOrderFormNew } from './ClaimPaymentOrderFormNew'
import { ClaimPaymentOrderTablesNew } from './CaimPaymentOrderTablesNew'
import { ClaimPayoutNotes } from 'portals/hope/features/claims/new/PaymentOrder/ClaimPayoutNotes'

export const ClaimPaymentOrdersNew = () => {
  return (
    <Flex direction="column" gap="medium">
      <ClaimPaymentOrderTablesNew />
      <ClaimPayoutNotes />
      <ClaimPaymentOrderFormNew />
    </Flex>
  )
}
