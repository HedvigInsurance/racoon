'use client'

import { StepperInput } from '@/components/StepperInput/StepperInput'
import { Field } from '@/features/widget/debuggerTrial.types'

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
