'use client'

import { useFormState } from 'react-dom'
import { Space } from 'ui'
import { Field } from '@/app/debugger/trial/debuggerTrial.types'
import { SubmitButton } from '@/appComponents/SubmitButton'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import * as InputRadio from '@/components/PriceCalculator/InputRadio'
import { TextField } from '@/components/TextField/TextField'
import { setupTrialContract } from '../actions'
import { CoInsuredCount } from './CoInsuredCount'

const partnerOptions = [
  { name: 'Avy', value: 'AVY' },
  { name: 'Stena Fastigheter', value: 'STENA_FASTIGHETER' },
  { name: 'Byggvesta', value: 'BYGGVESTA' },
  { name: 'Samtrygg', value: 'SAMTRYGG' },
  { name: 'Hedvig', value: 'HEDVIG' },
]

export function TrialContractForm() {
  // 10 days from now
  const defaultStartDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const [state, formAction] = useFormState(setupTrialContract, {
    fields: {
      [Field.partner]: partnerOptions[0].value,
      [Field.firstName]: 'Sven',
      [Field.lastName]: 'Svensson',
      [Field.startDate]: defaultStartDate,
      [Field.street]: 'Kungsholms strand 181',
      [Field.zipCode]: '112 48',
      [Field.subType]: 'RENT',
    },
  })

  return (
    <Space y={1}>
      <form action={formAction}>
        <Space y={0.25}>
          <InputSelect
            name={Field.partner}
            label="Select partner..."
            options={partnerOptions}
            defaultValue={state?.fields?.[Field.partner]}
          />

          <TextField
            label="First name"
            name={Field.firstName}
            required={true}
            defaultValue={state?.fields?.[Field.firstName]}
          />
          <TextField
            label="Last name"
            name={Field.lastName}
            required={true}
            defaultValue={state?.fields?.[Field.lastName]}
          />
          <TextField
            label="Start date (YYYY-MM-DD)"
            name={Field.startDate}
            required={true}
            pattern="\d{4}-\d{2}-\d{2}"
            defaultValue={state?.fields?.[Field.startDate]}
          />
          <TextField
            label="Street"
            name={Field.street}
            required={true}
            defaultValue={state?.fields?.[Field.street]}
          />
          <TextField
            label="Zip Code"
            name={Field.zipCode}
            required={true}
            pattern="\d{3} \d{2}"
            defaultValue={state?.fields?.[Field.zipCode]}
          />
          <InputRadio.HorizontalRoot
            name={Field.subType}
            label="Sub Type"
            required={true}
            defaultValue={state?.fields?.[Field.subType]}
          >
            <InputRadio.HorizontalItem label="Rent" value="RENT" />
            <InputRadio.HorizontalItem label="Own" value="BRF" />
          </InputRadio.HorizontalRoot>

          <TextField
            type="email"
            label="Email"
            name={Field.email}
            placeholder="Leave empty to randomize"
          />
          <PersonalNumberField label="Personal number" name={Field.ssn} />
          <TextField
            label="Birth date (YYYY-MM-DD)"
            name={Field.birthDate}
            pattern="\d{4}-\d{2}-\d{2}"
          />
          <CoInsuredCount />
          <TextField
            name={Field.livingSpace}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            label="Living space (m²)"
          />
          <InputRadio.HorizontalRoot name={Field.isStudent} label="Student?">
            <InputRadio.HorizontalItem label="Student" value="true" />
            <InputRadio.HorizontalItem label="Not student" value="false" />
          </InputRadio.HorizontalRoot>

          <SubmitButton>Create trial contract</SubmitButton>
        </Space>
      </form>
      <ErrorMessages errors={state?.errors?.generic} />
    </Space>
  )
}
