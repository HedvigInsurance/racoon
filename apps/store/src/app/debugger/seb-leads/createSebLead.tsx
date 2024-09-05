'use server'

import { SEBFormElement } from '@/app/debugger/seb-leads/types'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'

export const createSebLead = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const ssn = formData.get(SEBFormElement.SSN) as string
  const firstName = formData.get(SEBFormElement.FirstName) as string
  const lastName = formData.get(SEBFormElement.LastName) as string
  const email = formData.get(SEBFormElement.Email) as string
  const phoneNumber = formData.get(SEBFormElement.PhoneNumber) as string
  const product = formData.get(SEBFormElement.Product) as string

  const parameters = {
    personalNumber: ssn,
    firstName: firstName,
    lastName: lastName,
    contactPhone: phoneNumber,
    contactEmail: email,
    metadata: {
      productType: product,
    },
  }
  let sebSessionId: string | null

  try {
    const result = await createSebLeadStaging(parameters)
    sebSessionId = result.sessionId
    if (!sebSessionId) {
      throw new Error(`No sessionId in response (${JSON.stringify(result)})`)
    }
    const message = `Lead created, sebSessionId=${sebSessionId}`
    return {
      messages: [{ type: 'success', content: message }],
    }
  } catch (error) {
    console.error('Error creating car trial', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return {
      errors: {
        generic: [errorMessage],
      },
    }
  }
}

type CreateSebLeadsParams = {
  personalNumber: string
  firstName: string
  lastName: string
  contactPhone: string
  contactEmail: string
  metadata: {
    productType: string
  }
}
type CreateSebLeadsResponse = {
  errorCode: string | null
  errorMessage: string | null
  sessionId: string | null
}

const createSebLeadStaging = async (
  params: CreateSebLeadsParams,
): Promise<CreateSebLeadsResponse> => {
  const API_URL = process.env.SEB_LEADS_API_URL
  if (!API_URL) {
    throw new Error('SEB_LEADS_API_URL not configured')
  }
  const API_KEY = process.env.SEB_LEADS_API_KEY
  if (!API_KEY) {
    throw new Error('SEB_LEADS_API_KEY not configured')
  }
  const url = new URL(API_URL)
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization-token': API_KEY,
    'Insurely-version': '2024-06-01',
    'User-Agent': 'SEB Hedvig Leads Test SE',
  })

  const body = JSON.stringify(params)

  console.debug(`Creating SEB lead for ${params.personalNumber}`, body)

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: headers,
  })
  const result = (await await response.json()) as CreateSebLeadsResponse
  console.log('API response', result)
  if (!response.ok) {
    throw new Error(`${result.errorCode}: ${result.errorMessage ?? 'Unknown error'}`)
  }
  return result
}
