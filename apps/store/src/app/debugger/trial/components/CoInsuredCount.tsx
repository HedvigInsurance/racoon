'use client'

import { Field } from '@/app/debugger/trial/debuggerTrial.types'
import { StepperInput } from '@/components/StepperInput/StepperInput'

export function CoInsuredCount() {
  return (
    <StepperInput
      name={Field.numberCoInsured}
      min={0}
      max={6}
      optionLabel={(count) => (count === 0 ? 'No co-insured' : `${count} co-insured`)}
    />
  )
}
