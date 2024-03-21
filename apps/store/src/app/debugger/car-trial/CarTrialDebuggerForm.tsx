'use client'

import { useFormState } from 'react-dom'
import { Text, Space } from 'ui'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { AttentionCard } from '@/components/InfoCard/InfoCard'
import { InputCarRegistrationNumber } from '@/components/InputCarRegistrationNumber/InputCarRegistrationNumber'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { Field } from '@/features/carDealership/DebuggerCarTrial/debuggerCarTrial.types'
import { createCarTrial } from './actions'

const TIER_OPTIONS = [
  { name: 'Half', value: '1' },
  { name: 'Full', value: '2' },
]

export const CarTrialDebuggerForm = () => {
  const [state, formAction] = useFormState(createCarTrial, {
    fields: {
      [Field.Tier]: '1',
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
          <Space y={0.5}>
            <SubmitButton>Create car trial</SubmitButton>
            <Text as="p" size="xs" align="center" color="textSecondary">
              This is an internal tool
            </Text>
          </Space>
        </Space>
      </form>
      {state?.errors?.generic && (
        <ErrorCard errorCode={'VALIDATION_FAILED'} errorMessage={state.errors.generic[0]} />
      )}
    </>
  )
}

const ErrorCard = (props: { errorCode: string; errorMessage: string }) => (
  <AttentionCard>
    <Space y={0.5} style={{ width: '100%' }}>
      <Text as="p" color="textTranslucentPrimary">
        Unable to create trial
      </Text>
      <Text as="p" color="signalAmberText">
        {props.errorMessage}
      </Text>
    </Space>
  </AttentionCard>
)
