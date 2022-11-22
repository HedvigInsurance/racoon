import { useState } from 'react'
import { Insurance } from '@/services/insurances'
import { useSelectedInsurancesFromURL } from './useSelectedInsurancesFromURL'

export const useInsuranceSelectorFormState = (insurances: Array<Insurance>) => {
  const selectedInsurancesFromURL = useSelectedInsurancesFromURL()

  const [state, setState] = useState<Record<string, boolean>>(() => {
    return insurances.reduce<Record<string, boolean>>(
      (result, insurance) => ({
        ...result,
        [insurance.fieldName]: selectedInsurancesFromURL.includes(insurance.typeOfContract),
      }),
      {},
    )
  })

  return [state, setState] as const
}
