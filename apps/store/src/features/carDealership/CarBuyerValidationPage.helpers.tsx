import { useState } from 'react'
import { CarTrialValidationResult, ValidateCarTrialParams } from './validateCarDealershipTrial'

export enum Field {
  SSN = 'ssn',
  RegistrationNumber = 'registrationNumber',
  Tier = 'vtrCoverageCode',
}

export type CartTrialValidationState = {
  type: 'IDLE' | 'LOADING'
  result: CarTrialValidationResult | null
  parameters: {
    [Field.SSN]: string
    [Field.RegistrationNumber]: string
  } | null
}

export const useCarBuyerValidationPageState = () => {
  const [state, setState] = useState<CartTrialValidationState>({
    type: 'IDLE',
    result: null,
    parameters: null,
  })
  return [state, setState] as const
}

export const validateCarTrial = async ({
  dealerId,
  ...params
}: ValidateCarTrialParams): Promise<CarTrialValidationResult> => {
  const actionUrl = `/api/car-buyer/validation/${dealerId}`
  const response = await fetch(actionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await response.json()
}
