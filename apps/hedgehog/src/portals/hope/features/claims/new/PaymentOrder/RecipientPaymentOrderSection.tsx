import {
  CheckboxInput,
  DropdownInput,
  Flex,
  Grid,
  Input,
  LegacyTooltip,
} from '@hedvig-ui/redesign'
import { PaymentOrderFormSection } from './ClaimPaymentOrderFormNew'
import { ComponentProps, useState } from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import {
  CostType,
  PaymentMethod,
  PaymentRecipientType,
} from '@hope/features/config/constants'
import {
  ClaimMemberFragment,
  PaymentOrderRecipient,
  PaymentOrderSettleAction,
  UpsertPaymentOrderInput,
} from 'types/generated/graphql'
import { convertEnumToSentence } from '@hedvig-ui'
import { theme } from '@hedvig-ui/redesign/theme'
import { AutoCompleteRecipient } from './Recipient/AutoCompleteRecipient'
import { Info } from 'react-bootstrap-icons'

export const RecipientPaymentOrderSection: PaymentOrderFormSection = {
  Component,
  extractPayload,
}

function Component() {
  const { member, isPotentiallySanctioned } = useClaim()
  const automaticPayoutAvailable = !!member.payoutMethodStatus?.activated
  const [isManualPayment, setIsManualPayment] = useState(
    !automaticPayoutAvailable,
  )
  const [shouldCloseClaim, setShouldCloseClaim] = useState(false)

  const memberFullName = `${member.firstName} ${member.lastName}`
  return (
    <>
      <Flex direction="column" gap="medium">
        <Flex direction="row" gap="large" align="center">
          <span style={{ display: 'flex' }}>
            <CheckboxInput
              label="Close Claim on settle"
              name="settleAction"
              defaultChecked={shouldCloseClaim}
              onChange={(e) => {
                setShouldCloseClaim(e.target.checked)
              }}
            />
            <LegacyTooltip
              content={
                'When this payment order is settled, the claim will be closed;\nhowever, if there are other payment orders still open,\nthe claim will remain active'
              }
            >
              <Info style={{ position: 'relative' }} />
            </LegacyTooltip>
          </span>
          <CheckboxInput label="Ex Gratia" name="isExGratia" />
          <CheckboxInput
            label="Manual payment"
            name="isManualPayment"
            disabled={!automaticPayoutAvailable}
            defaultChecked={isManualPayment}
            onChange={(e) => setIsManualPayment(e.target.checked)}
          />
          {isPotentiallySanctioned && (
            <CheckboxInput
              label="Skip sanction check"
              name="sanctionListSkipped"
            />
          )}
          {!isManualPayment ? (
            <span
              style={{
                color: theme.colors.textTertiary,
                fontSize: theme.fontSizes.sm,
              }}
            >
              Will be paid out directly to {memberFullName}
            </span>
          ) : null}
        </Flex>
      </Flex>

      {isManualPayment && <RecipientForm memberFullname={memberFullName} />}
    </>
  )
}

function extractPayload(
  data: FormData,
  { member }: { member: ClaimMemberFragment },
): Partial<UpsertPaymentOrderInput> {
  const isExGratia = !!data.get('isExGratia')
  const isManualPayment = !!data.get('isManualPayment')
  const sanctionListSkipped = !!data.get('sanctionListSkipped')
  const readyInBank = !!data.get('readyInBank')
  const shouldCloseClaim = !!data.get('settleAction')

  if (!isManualPayment) {
    // automatic payment happy-path
    return {
      isExGratia,
      sanctionListSkipped,
      settleAction: shouldCloseClaim
        ? PaymentOrderSettleAction.CloseClaimOnSettlement
        : PaymentOrderSettleAction.KeepClaimOpenOnSettlement,
      recipientType: PaymentRecipientType.INDIVIDUAL,
      method: PaymentMethod.AUTOGIRO,
      costType: CostType.INDEMNITY_COST,
      recipientName: `${member.firstName} ${member.lastName}`,
    }
  }

  const required = (name: string): string => data.get(name)!.toString()
  const optional = (name: string): string | null =>
    data.get(name) ? data.get(name)!.toString() : null

  return {
    isExGratia,
    sanctionListSkipped,
    readyInBank,
    settleAction: shouldCloseClaim
      ? PaymentOrderSettleAction.CloseClaimOnSettlement
      : PaymentOrderSettleAction.KeepClaimOpenOnSettlement,
    recipientType: required('recipientType'),
    method: required('paymentMethod'),
    costType: optional('costType') ?? CostType.INDEMNITY_COST,
    recipientName: required('recipientName'),
    bankName: optional('bankName'),
    number: required('number'),
    reference: required('reference'),
    dueDate: optional('dueDate'),
  }
}

const DEFAULT_RECIPIENT: PaymentOrderRecipient = {
  recipientName: '',
  recipientType: PaymentRecipientType.INDIVIDUAL,
  method: PaymentMethod.BANKACCOUNT,
}

function RecipientForm({ memberFullname }: { memberFullname: string }) {
  const [defaultRecipient, setDefaultRecipient] =
    useState<PaymentOrderRecipient>({
      ...DEFAULT_RECIPIENT,
      recipientName: memberFullname,
    })

  const recipientTypeOptions: ComponentProps<typeof DropdownInput>['options'] =
    [
      {
        label: 'Individual',
        value: PaymentRecipientType.INDIVIDUAL,
        action: () => {
          setDefaultRecipient({
            ...DEFAULT_RECIPIENT,
            recipientName: memberFullname,
          })
        },
      },
      {
        label: 'Company',
        value: PaymentRecipientType.COMPANY,
        action: () => {
          setDefaultRecipient({
            ...DEFAULT_RECIPIENT,
            recipientType: PaymentRecipientType.COMPANY,
            recipientName: '',
          })
        },
      },
    ]

  return (
    <Flex direction="column" gap="small">
      <Grid equalColumns={2} gap="small">
        <DropdownInput
          label="Recipient"
          name="recipientType"
          options={recipientTypeOptions}
        />
        {defaultRecipient.recipientType === PaymentRecipientType.COMPANY ? (
          <AutoCompleteRecipient
            defaultRecipient={defaultRecipient}
            onSelectRecipient={setDefaultRecipient}
          />
        ) : (
          <Input
            label="Recipient name"
            name="recipientName"
            defaultValue={defaultRecipient.recipientName}
          />
        )}
      </Grid>

      <ManualPayoutForm
        // This is a workaround to update the form with default values when default recipient changes
        key={JSON.stringify(defaultRecipient)}
        defaultRecipient={defaultRecipient}
      />
    </Flex>
  )
}

function ManualPayoutForm({
  defaultRecipient,
}: {
  defaultRecipient: PaymentOrderRecipient
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    defaultRecipient.method as PaymentMethod,
  )
  const availableCostTypes = getRecipientTypeCostTypes(
    defaultRecipient.recipientType as PaymentRecipientType,
  )
  const availablePaymentMethods = getRecipientTypePaymentMethods(
    defaultRecipient.recipientType as PaymentRecipientType,
  )

  const paymentMethodSpecificFields =
    getPaymentMethodSpecificFields(paymentMethod)

  return (
    <>
      <Grid equalColumns={2} gap="small">
        <DropdownInput
          label="Method"
          name="paymentMethod"
          defaultValue={defaultRecipient.method}
          options={availablePaymentMethods.map((method) => ({
            label: method.label,
            value: method.value,
            action: () => setPaymentMethod(method.value),
          }))}
        />
        <Input
          type="text"
          name="number"
          defaultValue={defaultRecipient.number ?? ''}
          required={true}
          label={`${convertEnumToSentence(paymentMethod)} number`}
        />
      </Grid>
      {paymentMethodSpecificFields.length > 0 && (
        <Grid equalColumns={2} gap="small">
          {paymentMethodSpecificFields.map((field) => (
            <Input
              key={field.name}
              type="text"
              name={field.name}
              defaultValue={defaultRecipient[field.name] ?? ''}
              required={field.required}
              label={field.label}
            />
          ))}
        </Grid>
      )}
      <Grid equalColumns={2} gap="small">
        <Input type="text" name="reference" required={true} label="Reference" />
        <div />
      </Grid>
      <Grid equalColumns={2} gap="small">
        <Input
          type="date"
          name="dueDate"
          required={false}
          label="Due date (optional)"
        />
        {availableCostTypes.length > 1 && (
          <DropdownInput
            label="Cost type"
            name="costType"
            options={availableCostTypes.map((costType) => ({
              label: costType.label,
              value: costType.value,
            }))}
          />
        )}
      </Grid>
    </>
  )
}

function getRecipientTypeCostTypes(recipientType: PaymentRecipientType) {
  switch (recipientType) {
    case PaymentRecipientType.COMPANY:
      return [
        { label: 'Indemnity cost', value: CostType.INDEMNITY_COST },
        { label: 'Expense', value: CostType.EXPENSE },
      ]
    case PaymentRecipientType.INDIVIDUAL:
    case PaymentRecipientType.UNKNOWN:
      return []
  }
}

function getRecipientTypePaymentMethods(recipientType: PaymentRecipientType) {
  switch (recipientType) {
    case PaymentRecipientType.COMPANY:
      return [
        { label: 'Bank Account', value: PaymentMethod.BANKACCOUNT },
        { label: 'Bankgiro', value: PaymentMethod.BANKGIRO },
        { label: 'Plusgiro', value: PaymentMethod.PLUSGIRO },
        { label: 'IBAN', value: PaymentMethod.IBAN },
      ]
    case PaymentRecipientType.INDIVIDUAL:
      return [{ label: 'Bank Account', value: PaymentMethod.BANKACCOUNT }]
    case PaymentRecipientType.UNKNOWN:
      return []
  }
}

function getPaymentMethodSpecificFields(paymentMethod: PaymentMethod): {
  name: keyof PaymentOrderRecipient
  label: string
  required: boolean
}[] {
  switch (paymentMethod) {
    case PaymentMethod.BANKACCOUNT:
      return [
        {
          name: 'bankName',
          label: 'Bank name',
          required: true,
        },
      ]
    case PaymentMethod.IBAN:
      return [
        {
          name: 'bankName',
          label: 'Bank name (optional)',
          required: false,
        },
        {
          name: 'bic',
          label: 'Bic number',
          required: true,
        },
      ]
  }
  return []
}
