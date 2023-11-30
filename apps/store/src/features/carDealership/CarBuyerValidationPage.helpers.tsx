import { useState } from 'react'
import { ValidateCarTrialParams } from './validateCarDealershipTrial'

export enum Field {
  SSN = 'ssn',
  RegistrationNumber = 'registrationNumber',
  Tier = 'vtrCoverageCode',
}

type ValidationError = { code: string; message: string }

type Result = {
  ssn: string
  registrationNumber: string
  error?: ValidationError
}

type State = { type: 'IDLE'; result: Result | null } | { type: 'LOADING'; result: Result | null }

export const useCarBuyerValidationPageState = () => {
  const [state, setState] = useState<State>({ type: 'IDLE', result: null })
  return [state, setState] as const
}

type ValidatationResponse = { ok: boolean; error: ValidationError }

export const validateCarTrial = async ({ dealerId, ...params }: ValidateCarTrialParams) => {
  const actionUrl = `/api/car-buyer/validation/${dealerId}`
  const response = await fetch(actionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return (await response.json()) as ValidatationResponse
}
