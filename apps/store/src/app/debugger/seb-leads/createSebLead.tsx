'use server'

import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import {getEnvOrThrow} from "@/utils/getEnvOrThrow";
import { SebDebuggerFormElement } from './constants'

export const createSebLead = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const ssn = formData.get(SebDebuggerFormElement.SSN) as string
  const firstName = formData.get(SebDebuggerFormElement.FirstName) as string
  const lastName = formData.get(SebDebuggerFormElement.LastName) as string
  const email = formData.get(SebDebuggerFormElement.Email) as string
  const phoneNumber = formData.get(SebDebuggerFormElement.PhoneNumber) as string
  let product = formData.get(SebDebuggerFormElement.Product) as string
  let  maybeProductSubType : string | undefined = undefined

  if (product === 'condoInsuranceBrf') {
    product = 'condoInsurance'
    maybeProductSubType = 'condoInsurance.condoInsuranceCondominium'
  } else if (product === 'condoInsuranceRent') {
    product = 'condoInsurance'
    maybeProductSubType = 'condoInsurance.condoInsuranceRental'
  }


  const parameters = {
    personalNumber: ssn,
    firstName: firstName,
    lastName: lastName,
    contactPhone: phoneNumber,
    contactEmail: email,
    metadata: {
      productType: product,
      productSubType: maybeProductSubType
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
    console.error('Error creating SEB lead', error)
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
  const API_URL = getEnvOrThrow('SEB_LEADS_INSURELY_API_URL')
  const API_KEY = getEnvOrThrow ('SEB_LEADS_INSURELY_API_KEY')

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
  const result = (await response.json()) as CreateSebLeadsResponse
  console.log('API response', result)
  if (!response.ok) {
    throw new Error(`${result.errorCode}: ${result.errorMessage ?? 'Unknown error'}`)
  }
  return result
}
