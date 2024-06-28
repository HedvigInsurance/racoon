'use server'

import { redirect } from 'next/navigation'
import { createTrial, getPartner, getTrialData } from '@/app/debugger/trial/debuggerTrial.utils'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { ORIGIN_URL } from '@/utils/url'

const LOCAL_URL = new URL(ORIGIN_URL)

export const setupTrialContract = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  let destination: string

  try {
    const partner = getPartner(formData)
    const data = getTrialData(formData)

    const { fullUrl } = await createTrial(partner, data)

    const nextURL = new URL(fullUrl)
    nextURL.hostname = LOCAL_URL.hostname
    nextURL.port = LOCAL_URL.port
    nextURL.protocol = LOCAL_URL.protocol

    destination = nextURL.toString()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return {
      errors: {
        generic: [errorMessage],
      },
    }
  }

  if (destination) {
    console.log(`Re-directing to destination: ${destination}`)
    redirect(destination)
  }
}
