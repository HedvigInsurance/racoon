import { usePaymentOrder } from '@hope/features/paymentOrders/hooks/use-payment-orders'
import { useRadioGroup } from '@hope/common/hooks/use-radio-group'
import {
  Carrier,
  CostCategory,
  CostType,
  PaymentMethod,
  PaymentRecipientType,
} from '@hope/features/config/constants'
import {
  Button,
  Checkbox,
  ConfirmWithValueModal,
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  Flex,
  InfoTag,
  Input,
  Label,
  Popover,
  StandaloneMessage,
  TextDatePicker,
  useClickOutside,
  useConfirmDialog,
} from '@hedvig-ui'
import { useForm } from 'react-hook-form'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  isValidInput,
  RadioButtonGroups,
  StyledForm,
  StyledFormRow,
  ValueCalculationRow,
} from '@hope/features/claims/claim-details/SubclaimPaymentOrders'
import { InfoCircle } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'
import {
  PaymentOrderInformationFragment,
  PaymentOrderRecipientFragment,
} from 'types/generated/graphql'
import { PaymentOrderRecipientSuggestions } from './PaymentOrderRecipientSuggestions'
import styled from '@emotion/styled'

const RecipientSuggestionWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 10;

  border-radius: 0.4rem;
  background-color: #fafafa;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
`

export type PaymentOrderFormValues = {
  recipientName: string
  deductible: string
  beforeAmount: string
  amount: number
  number: string | null | undefined
  bankName: string | null | undefined
  bic: string | null | undefined
  note: string
  reference: string | null | undefined
}

export const UpsertPaymentOrder: React.FC<{
  order: PaymentOrderInformationFragment | null
  subclaimId: string
  memberId?: string
  memberFullName: string
  preferredCurrency?: string
  isPaymentActivated: boolean
  isPotentiallySanctioned: boolean
  defaultDeductible: number
  carrier?: Carrier
  recoveriesPresent: boolean
}> = ({
  order,
  subclaimId,
  memberId,
  memberFullName,
  preferredCurrency,
  isPaymentActivated,
  isPotentiallySanctioned,
  defaultDeductible,
  carrier,
  recoveriesPresent,
}) => {
  const { confirm } = useConfirmDialog()
  const defaultFormValues = (order: PaymentOrderInformationFragment | null) =>
    !order
      ? {
          recipientName: memberFullName,
          deductible: '0', //defaultDeductible,
          beforeAmount: '0',
          amount: 0, //(-defaultDeductible).toString(),
          number: '',
          bankName: '',
          bic: '',
          note: '',
          reference: '',
        }
      : {
          recipientName: order.recipientName,
          deductible: String(order.deductible.amount),
          beforeAmount: String(order.amount.amount + order.deductible.amount),
          amount: order.amount.amount,
          number: order.number,
          bankName: order.bankName,
          bic: order.bic,
          note: '',
          reference: order.reference,
        }

  const { createPaymentOrder, updatePaymentOrder } = usePaymentOrder()

  const { register, watch, reset, setValue } = useForm({
    defaultValues: defaultFormValues(order),
  })

  const [showModal, setShowModal] = useState(false)
  const [isExGratia, setIsExGratia] = useState(order ? order.isExGratia : false)
  const [sanctionListSkipped, setSanctionListSkipped] = useState(
    !!order?.sanctionListSkipped,
  )
  const [isManualPayment, setIsManualPayment] = useState(
    order ? order.method !== PaymentMethod.AUTOGIRO : false,
  )
  const [dueDate, setDueDate] = useState<string | null>(
    order ? (order.dueDate ?? null) : null,
  )
  const [readyInBank, setReadyInBank] = useState(false)
  const currency = preferredCurrency!

  const {
    value: costType,
    setValue: setCostType,
    component: CostTypeRadioGroup,
  } = useRadioGroup<CostType>({
    label: 'Cost type',
    options: [
      { text: 'Indemnity cost', value: CostType.INDEMNITY_COST },
      { text: 'Expense', value: CostType.EXPENSE },
    ],
  })

  const [costCategory, setCostCategory] = useState<CostCategory>(
    CostCategory['Not specified'],
  )

  const {
    value: recipientType,
    setValue: setRecipientType,
    component: RecipientTypeRadioGroup,
  } = useRadioGroup<PaymentRecipientType>({
    label: 'Recipient',
    options: [
      { text: 'Individual', value: PaymentRecipientType.INDIVIDUAL },
      ...(!isManualPayment
        ? []
        : [{ text: 'Company', value: PaymentRecipientType.COMPANY }]),
    ],
  })

  const {
    value: method,
    setValue: setMethod,
    component: MethodRadioGroup,
  } = useRadioGroup<PaymentMethod>({
    label: 'Method',
    options: [
      ...(!isManualPayment && isPaymentActivated
        ? [{ text: 'Autogiro', value: PaymentMethod.AUTOGIRO }]
        : recipientType === PaymentRecipientType.INDIVIDUAL
          ? [{ text: 'Bank account', value: PaymentMethod.BANKACCOUNT }]
          : [
              { text: 'Bank account', value: PaymentMethod.BANKACCOUNT },
              { text: 'Bankgiro', value: PaymentMethod.BANKGIRO },
              { text: 'Plusgiro', value: PaymentMethod.PLUSGIRO },
              { text: 'Iban', value: PaymentMethod.IBAN },
            ]),
    ],
  })

  const toggleManualPayment = () => {
    setIsManualPayment((prev) => !prev)
    setRecipientType(PaymentRecipientType.INDIVIDUAL)
    setCostType(CostType.INDEMNITY_COST)
  }

  useEffect(() => {
    if (recipientType === PaymentRecipientType.INDIVIDUAL) {
      if (isManualPayment || !isPaymentActivated) {
        setMethod(PaymentMethod.BANKACCOUNT)
      } else {
        setMethod(PaymentMethod.AUTOGIRO)
      }
    }
  }, [
    setMethod,
    setValue,
    recipientType,
    memberFullName,
    isManualPayment,
    isPaymentActivated,
  ])

  const clearForm = (
    updatedOrder: PaymentOrderInformationFragment | null = null,
  ) => {
    const form = updatedOrder ?? order
    if (form) {
      setIsExGratia(form.isExGratia)
      setSanctionListSkipped(!!form.sanctionListSkipped)
      setIsManualPayment(form.method !== PaymentMethod.AUTOGIRO)
      setRecipientType(form.recipientType as PaymentRecipientType)
      setDueDate(form.dueDate)
      reset(defaultFormValues(form))
    } else {
      setIsExGratia(false)
      setSanctionListSkipped(false)
      setIsManualPayment(false)
      setRecipientType(PaymentRecipientType.INDIVIDUAL)
      setDueDate(null)
      reset(defaultFormValues(null))
    }
    setReadyInBank(false)
  }

  const onConfirmSuccess = async () => {
    if (!carrier) return toast.error('Could not find carrier for agreement')
    const deductible = parseFloat(watch('deductible'))
    if (isNaN(deductible)) return toast.error('Deductible is not a number')

    const body = {
      type: 'PAYOUT',
      carrier,
      costType,
      costCategory,
      method,
      number: watch('number'),
      bankName: watch('bankName'),
      bic: watch('bic'),
      amount: {
        amount: watch('amount'),
        currency,
      },
      deductible: {
        amount: deductible,
        currency,
      },
      isExGratia,
      sanctionListSkipped,
      note: watch('note'),
      recipientType,
      recipientName: isManualPayment ? watch('recipientName') : memberFullName,
      reference: watch('reference'),
      readyInBank,
      dueDate,
    }
    if (!order) {
      await createPaymentOrder(subclaimId, body)
      clearForm()
    } else {
      const result = await updatePaymentOrder(order.id, {
        type: 'PAYOUT',
        carrier,
        costType,
        costCategory,
        method,
        number: watch('number'),
        bankName: watch('bankName'),
        bic: watch('bic'),
        amount: {
          amount: watch('amount'),
          currency,
        },
        deductible: {
          amount: deductible,
          currency,
        },
        isExGratia,
        sanctionListSkipped,
        note: watch('note'),
        recipientType,
        recipientName: isManualPayment
          ? watch('recipientName')
          : memberFullName,
        reference: watch('reference'),
        readyInBank,
        dueDate,
      })
      const updated = result.data?.paymentOrder_update
      if (!updated) return
      clearForm(updated)
    }
  }

  const [showRecipientSuggestions, setShowRecipientSuggestions] =
    useState(false)
  const recipientSuggestionWrapperRef = useRef(null)

  useClickOutside(recipientSuggestionWrapperRef, (e) => {
    e.stopPropagation()
    setShowRecipientSuggestions(false)
  })

  const selectRecipientSuggestion = (
    recipient: PaymentOrderRecipientFragment,
  ) => {
    setShowRecipientSuggestions(false)

    setRecipientType(recipient.recipientType as PaymentRecipientType)
    setValue('recipientName', recipient.recipientName)
    setMethod(recipient.method as PaymentMethod)
    setValue('bankName', recipient.bankName)
    setValue('number', recipient.number)
    setValue('bic', recipient.bic)
  }

  if (!preferredCurrency || !memberId || !carrier) {
    return (
      <StandaloneMessage>
        Couldn't find enough information about member to make a payment order
      </StandaloneMessage>
    )
  }

  return (
    <>
      <ConfirmWithValueModal
        confirmValue={watch('amount').toString()}
        resolve={onConfirmSuccess}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />

      <StyledForm
        onSubmit={async (e) => {
          e.preventDefault()
          if (recoveriesPresent) {
            await confirm('⚠️ Member has recoveries present ⚠️')
          }
          setShowModal(true)
        }}
      >
        <Flex direction="column" gap="small">
          <ValueCalculationRow
            setValue={setValue}
            register={register}
            watch={watch}
            currency={preferredCurrency}
            defaultDeductible={defaultDeductible}
          />

          <Flex gap="small">
            <Checkbox
              tabIndex={-1}
              label="Ex Gratia"
              checked={isExGratia}
              onChange={() => setIsExGratia((prev) => !prev)}
            />
            <Checkbox
              tabIndex={-1}
              label="Manual payment"
              checked={isManualPayment}
              onChange={toggleManualPayment}
            />
            {isPotentiallySanctioned && (
              <Checkbox
                tabIndex={-1}
                label="Skip sanction check"
                checked={sanctionListSkipped}
                onChange={() => setSanctionListSkipped((prev) => !prev)}
              />
            )}
          </Flex>

          {(isManualPayment || isPaymentActivated) && (
            <RadioButtonGroups>
              <RecipientTypeRadioGroup />
              <MethodRadioGroup />
              {recipientType !== PaymentRecipientType.INDIVIDUAL && (
                <>
                  <CostTypeRadioGroup />
                </>
              )}
            </RadioButtonGroups>
          )}

          {isManualPayment && (
            <>
              <StyledFormRow columns={2}>
                <div style={{ position: 'relative' }}>
                  <Flex gap="small" align="center" justify="space-between">
                    <Label>Recipient</Label>
                    {recipientType !== PaymentRecipientType.COMPANY &&
                      !!memberFullName &&
                      memberFullName != watch('recipientName') && (
                        <Popover contents={`Use member name`}>
                          <InfoTag
                            onClick={() =>
                              setValue('recipientName', memberFullName)
                            }
                            style={{
                              marginBottom: '0.4rem',
                              cursor: 'pointer',
                            }}
                            status="info"
                          >
                            Autofill
                          </InfoTag>
                        </Popover>
                      )}
                  </Flex>
                  <Input
                    {...register('recipientName')}
                    name={'recipientName'}
                    placeholder={
                      recipientType === PaymentRecipientType.COMPANY
                        ? 'Company name'
                        : 'Name'
                    }
                    onFocus={() => {
                      if (recipientType != PaymentRecipientType.COMPANY) return
                      setShowRecipientSuggestions(true)
                    }}
                  />
                  {showRecipientSuggestions && (
                    <RecipientSuggestionWrapper
                      ref={recipientSuggestionWrapperRef}
                    >
                      <PaymentOrderRecipientSuggestions
                        searchString={watch('recipientName')}
                        onSelect={selectRecipientSuggestion}
                      />
                    </RecipientSuggestionWrapper>
                  )}
                </div>
              </StyledFormRow>

              {[PaymentMethod.BANKACCOUNT, PaymentMethod.IBAN].includes(
                method as PaymentMethod,
              ) && (
                <StyledFormRow columns={2}>
                  <Input
                    {...register('bankName')}
                    placeholder="Bank..."
                    label={'Bank name (Optional)'}
                  />
                  {method === PaymentMethod.IBAN && (
                    <Input
                      {...register('bic')}
                      placeholder="Number..."
                      label={'Bic number'}
                    />
                  )}
                </StyledFormRow>
              )}
              <StyledFormRow columns={2}>
                <Input
                  {...register('number')}
                  placeholder="Number..."
                  label={`${convertEnumToTitle(method)} number`}
                />
                <div>
                  <Flex gap="small" align="center" justify="space-between">
                    <Label>Reference</Label>
                    {!!memberId &&
                      watch('reference') !== `Claim ${memberId}` && (
                        <Popover
                          position="left"
                          contents={`Use 'Claim ${memberId}'`}
                        >
                          <InfoTag
                            onClick={() =>
                              setValue('reference', `Claim ${memberId}`)
                            }
                            style={{
                              marginBottom: '0.4rem',
                              cursor: 'pointer',
                            }}
                            status="info"
                          >
                            Autofill
                          </InfoTag>
                        </Popover>
                      )}
                  </Flex>
                  <Input
                    {...register('reference')}
                    placeholder={
                      method === PaymentMethod.BANKGIRO ||
                      method === PaymentMethod.PLUSGIRO
                        ? 'OCR...'
                        : 'Reference...'
                    }
                  />
                </div>
              </StyledFormRow>

              <StyledFormRow>
                <TextDatePicker
                  placeholder="Write when here..."
                  label="Due date (Optional)"
                  value={dueDate}
                  onChange={setDueDate}
                />
              </StyledFormRow>
            </>
          )}
          <div style={{ width: '100%' }}>
            <Label>Cost category</Label>
            <Dropdown>
              {Object.entries(CostCategory).map(([displayName, category]) => (
                <DropdownOption
                  key={category}
                  selected={costCategory === category}
                  onClick={() => setCostCategory(category)}
                >
                  {displayName}
                </DropdownOption>
              ))}
            </Dropdown>
          </div>

          <Input
            {...register('note')}
            label="Note"
            placeholder="Minimum 5 characters"
          />
          <Flex gap="small" align="center" justify="space-between">
            {!isPaymentActivated && !isManualPayment ? (
              <Flex align="center" gap="small">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={toggleManualPayment}
                >
                  Request manual payment
                </Button>
                <div>
                  <Flex align="center">
                    <InfoCircle />
                    <span style={{ marginLeft: '0.5rem' }}>
                      Direct debit not activated
                    </span>
                  </Flex>
                </div>
              </Flex>
            ) : (
              <Flex gap="small" align="center" justify="space-between">
                <Flex gap="small">
                  <Button type="submit" disabled={!isValidInput(watch)}>
                    {!order ? 'Create' : 'Edit'} order
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => clearForm()}
                  >
                    Reset form
                  </Button>
                </Flex>
              </Flex>
            )}

            <div style={{ width: 'max-content', marginLeft: 'auto' }}>
              <Flex align="center" gap="tiny">
                {isManualPayment && (
                  <Checkbox
                    label="Ready in bank"
                    checked={readyInBank}
                    onChange={() => setReadyInBank((prev) => !prev)}
                  />
                )}
              </Flex>
            </div>
          </Flex>
        </Flex>
      </StyledForm>
    </>
  )
}
