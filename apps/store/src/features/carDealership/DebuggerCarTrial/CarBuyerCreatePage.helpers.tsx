import { useState } from 'react'
import { CarTrialResult, CreateCarTrialParams } from './createCarDealershipTrial'

export enum Field {
  SSN = 'ssn',
  RegistrationNumber = 'registrationNumber',
  Tier = 'vtrCoverageCode',
}

export type CartTrialCreateState = {
  type: 'IDLE' | 'LOADING'
  result: CarTrialResult | null
  parameters: {
    [Field.SSN]: string
    [Field.RegistrationNumber]: string
  } | null
}

export const useCarBuyerCreatePageState = () => {
  const [state, setState] = useState<CartTrialCreateState>({
    type: 'IDLE',
    result: null,
    parameters: null,
  })
  return [state, setState] as const
}

export const createCarTrial = async ({
  dealerId,
  ...params
}: CreateCarTrialParams): Promise<CarTrialResult> => {
  const actionUrl = `/api/car-buyer/create/${dealerId}`
  const response = await fetch(actionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await response.json()
}
