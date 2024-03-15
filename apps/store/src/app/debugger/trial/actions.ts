'use server'

import { redirect } from 'next/navigation'
import { createTrial, getPartner, getTrialData } from '@/features/widget/debuggerTrialCreate'
import { ORIGIN_URL } from '@/utils/PageLink'

const LOCAL_URL = new URL(ORIGIN_URL)

export const setupTrialContract = async (formData: FormData) => {
  const partner = getPartner(formData)
  const data = getTrialData(formData)

  let destination = ''

  try {
    const { fullUrl } = await createTrial(partner, data)

    const nextURL = new URL(fullUrl)
    nextURL.hostname = LOCAL_URL.hostname
    nextURL.port = LOCAL_URL.port
    nextURL.protocol = LOCAL_URL.protocol

    destination = nextURL.toString()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.log({ errorMessage })
    throw new Error(errorMessage)
  } finally {
    console.log(`Re-directing to destination: ${destination}`)
    redirect(destination)
  }
}
