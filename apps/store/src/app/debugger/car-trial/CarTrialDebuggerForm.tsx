'use client'

import { useFormState } from 'react-dom'
import { Text, Space } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'
import { InputCarRegistrationNumber } from '@/components/InputCarRegistrationNumber/InputCarRegistrationNumber'
import { InputRadio } from '@/components/InputRadio/InputRadio'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { Field } from '@/features/carDealership/DebuggerCarTrial/debuggerCarTrial.types'
import { createCarTrial } from './actions'

const TIER_OPTIONS = [
  { name: 'Half insurance', value: '1' },
  { name: 'Full insurance', value: '2' },
]

const PRODUCT_OPTIONS = [{ name: 'Hedvig', value: 'HEDVIG' }]

export const CarTrialDebuggerForm = () => {
  const [state, formAction] = useFormState(createCarTrial, {
    fields: {
      [Field.Tier]: '1',
      [Field.Product]: PRODUCT_OPTIONS[0].value,
    },
  })

  return (
    <>
      <form action={formAction}>
        <Space y={0.25}>
          <PersonalNumberField name={Field.SSN} label="SSN (YYMMDD-XXXX)" required={true} />
          <InputCarRegistrationNumber
            name={Field.RegistrationNumber}
            label="Registration number"
            required={true}
          />
          <InputSelect
            name={Field.Tier}
            label="Tier"
            required={true}
            defaultValue={state?.fields?.[Field.Tier]}
            options={TIER_OPTIONS}
          />

          <InputRadio
            name={Field.Product}
            label="Product"
            defaultValue={state?.fields?.[Field.Product]}
            options={PRODUCT_OPTIONS.map((option) => ({ label: option.name, value: option.value }))}
          />

          <Space y={0.5}>
            <SubmitButton>Create car trial</SubmitButton>
            <Text as="p" size="xs" align="center" color="textSecondary">
              This is an internal tool
            </Text>
          </Space>
        </Space>
      </form>
      <ErrorMessages errors={state?.errors?.generic} />
    </>
  )
}
