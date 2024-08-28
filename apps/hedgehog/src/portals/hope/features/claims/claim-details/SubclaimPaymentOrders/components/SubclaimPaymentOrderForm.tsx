import * as React from 'react'
import styled from '@emotion/styled'
import { Flex, spacingMap, SpacingSize } from '@hedvig-ui'
import { PaymentOrderInformationFragment } from 'types/generated/graphql'
import { Carrier, Market } from '@hope/features/config/constants'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { UseFormWatch } from 'react-hook-form'
import { UpsertPaymentOrder } from '@hope/features/claims/claim-details/SubclaimPaymentOrders'
import { PaymentOrderFormValues } from './UpsertPaymentOrder'

export const StyledForm = styled.form`
  width: 100%;
  margin-top: 1rem;
`

export const StyledCalculationRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2rem 1fr 2rem 1fr;
`

export const StyledFormRow = styled.div<{
  columns?: number
  gap?: SpacingSize
}>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns ?? 3}, 1fr);
  gap: ${({ gap }) => spacingMap[gap ?? 'small']};
`

export const StyledOperator = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding: 10px 0;
`

export const RadioButtonGroups = styled(Flex)`
  & > div {
    width: 9rem;
  }
`

export const isValidInput = (watch: UseFormWatch<PaymentOrderFormValues>) =>
  !isNaN(+watch('deductible')) &&
  !isNaN(+watch('amount')) &&
  !!watch('deductible') &&
  !!watch('amount') &&
  !!watch('note') &&
  watch('note').length > 4

export const SubclaimPaymentOrderForm: React.FC<{ subclaimId: string }> = ({
  subclaimId,
}) => {
  const {
    member,
    getSubclaim,
    isPotentiallySanctioned,
    preferredCurrency,
    agreement,
  } = useClaim()
  const subclaim = getSubclaim(subclaimId)
  const memberId = member.memberId
  const memberFullName = `${member?.firstName} ${member?.lastName}`
  const recoveriesPresent = !!subclaim?.recoveries?.length
  const isPaymentActivated =
    member?.contractMarketInfo?.market !== Market.Sweden
      ? false
      : !!member?.directDebitStatus?.activated ||
        !!member?.payoutMethodStatus?.activated
  const defaultDeductible = subclaim?.claimType?.defaultDeductible ?? 0
  const agreementCarrier = agreement?.carrier as Carrier | undefined
  const carrier = agreementCarrier ? agreementCarrier : undefined

  const props = {
    subclaimId,
    memberId,
    memberFullName,
    preferredCurrency,
    isPaymentActivated,
    isPotentiallySanctioned,
    defaultDeductible,
    carrier,
    recoveriesPresent,
  }

  if (!member || !subclaim || !preferredCurrency) {
    return null
  }

  return <PaymentOrderForm {...props} />
}

export const PaymentOrderForm: React.FC<{
  editOrder?: boolean
  order?: PaymentOrderInformationFragment
  onSuccess?: () => void
  subclaimId: string
  memberId?: string
  memberFullName: string
  preferredCurrency?: string
  isPaymentActivated: boolean
  isPotentiallySanctioned: boolean
  defaultDeductible: number
  carrier?: Carrier
  recoveriesPresent: boolean
}> = ({ editOrder, order, ...rest }) => {
  if (editOrder && order) {
    return <UpsertPaymentOrder order={order} {...rest} />
  }
  return <UpsertPaymentOrder order={null} {...rest} />
}
