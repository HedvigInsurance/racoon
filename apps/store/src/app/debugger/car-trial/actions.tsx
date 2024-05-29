'use server'

import { redirect } from 'next/navigation'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { createCarDealershipTrial } from '@/features/carDealership/DebuggerCarTrial/createCarDealershipTrial'
import { Field } from '@/features/carDealership/DebuggerCarTrial/debuggerCarTrial.types'

export const createCarTrial = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const ssn = formData.get(Field.SSN) as string
  const registrationNumber = formData.get(Field.RegistrationNumber) as string
  const tier = formData.get(Field.Tier) as string
  const product = formData.get(Field.Product) as string

  const parameters = {
    ssn,
    registrationNumber,
    vtrCoverageCode: tier,
    product: product,
    dealerId: 'MODERNA_BIL',
  }
  let destination: string

  try {
    const result = await createCarDealershipTrial(parameters)
    destination = result.trialUrl
  } catch (error) {
    console.error('Error creating car trial', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return {
      errors: {
        generic: [errorMessage],
      },
    }
  }

  if (destination) {
    console.log(`Re-directing to car trial page: ${destination}`)
    redirect(destination)
  }
}
