import { StandaloneMessage, useConfirmDialog } from '@hedvig-ui'
import { useClaim } from '../../hooks/use-claim'
import { InsurableLimitsPaymentOrderFormSection } from './InsurableLimitsPaymentOrderFormSection'
import { NoCarrierPaymentPlaceholder } from '../../claim-details/ClaimSubclaims/components/NoCarrierPlaceholder'
import { ClaimState } from '../../../config/constants'
import { Button, Card, Flex, Hr } from '@hedvig-ui/redesign'
import {
  ClaimMemberFragment,
  UpsertPaymentOrderInput,
} from 'types/generated/graphql'
import {
  FormEventHandler,
  ReactNode,
  RefObject,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AmountOrderFormSection } from './AmountOrderFormSection'
import { RecipientPaymentOrderSection } from './RecipientPaymentOrderSection'
import { MiscPaymentOrderSection } from './MiscPaymentOrderSection'
import { usePaymentOrder } from '../../../paymentOrders/hooks/use-payment-orders'

export type PaymentOrderFormSection = {
  Component: (props: { formRef: RefObject<HTMLFormElement> }) => ReactNode
  extractPayload: (
    data: FormData,
    context: { member: ClaimMemberFragment; currency: string },
  ) => Partial<UpsertPaymentOrderInput>
}

export const ClaimPaymentOrderFormNew = () => {
  const { preferredCurrency, claimState, agreement } = useClaim()
  const claimIsClosed = claimState === ClaimState.Closed
  const [formRevision, setFormRevision] = useState(0)
  const claimHasCarrier = !!agreement?.carrier

  if (claimIsClosed) {
    return (
      <StandaloneMessage>
        Cannot add payment orders when claim is closed
      </StandaloneMessage>
    )
  }

  if (!preferredCurrency) {
    return (
      <StandaloneMessage>
        Could not find the member's preferred currency for payments
      </StandaloneMessage>
    )
  }

  if (!claimHasCarrier) {
    return <NoCarrierPaymentPlaceholder />
  }

  const resetForm = () => {
    setFormRevision((previous) => previous + 1)
  }

  return (
    <SubclaimPaymentOrderFormContainer
      key={formRevision}
      onSuccess={resetForm}
      onReset={resetForm}
    />
  )
}

const SubclaimPaymentOrderFormContainer = ({
  onSuccess,
  onReset,
}: {
  onSuccess: () => void
  onReset: () => void
}) => {
  const {
    member,
    insurableLimits,
    refetch,
    preferredCurrency,
    agreement,
    subclaims,
  } = useClaim()
  const validSubclaims = useMemo(
    () => subclaims.filter((sc) => !!sc.type),
    [subclaims],
  )

  const { createPaymentOrder, loading } = usePaymentOrder()
  const { confirm } = useConfirmDialog()

  const sections = useMemo(() => {
    const formSections: PaymentOrderFormSection[] = []
    if (insurableLimits) {
      formSections.push(InsurableLimitsPaymentOrderFormSection)
    } else {
      formSections.push(AmountOrderFormSection)
    }
    formSections.push(RecipientPaymentOrderSection)
    formSections.push(MiscPaymentOrderSection({ subclaims: validSubclaims }))
    return formSections
  }, [insurableLimits, validSubclaims])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const subclaimId = formData.get('subclaimId')!.toString()
    const paymentOrder: Partial<UpsertPaymentOrderInput> = {
      carrier: agreement?.carrier,
      type: 'PAYOUT',
    }

    for (const section of sections) {
      Object.assign(
        paymentOrder,
        section.extractPayload(formData, {
          currency: preferredCurrency!,
          member,
        }),
      )
    }

    try {
      await confirm('Are you sure you want to create this payment order?')
      await createPaymentOrder(
        subclaimId,
        paymentOrder as UpsertPaymentOrderInput,
      )
      refetch()
      onSuccess()
    } catch {
      return null
    }
  }

  const formRef = useRef<HTMLFormElement>(null)

  if (!validSubclaims.length) {
    return (
      <StandaloneMessage>
        Cannot create a payment order without a claim type
      </StandaloneMessage>
    )
  }
  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <Card p={'large'}>
        <Flex direction="column" gap="medium">
          Add new payment order
          <Hr />
          <Flex direction={'column'} gap={'large'}>
            {sections.map((section, i) => (
              <section.Component formRef={formRef} key={i} />
            ))}

            <Flex justify={'flex-start'} gap={'medium'}>
              <Button type="submit" disabled={loading}>
                Create order
              </Button>
              <Button type={'button'} variant={'secondary'} onClick={onReset}>
                Reset order
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </form>
  )
}
