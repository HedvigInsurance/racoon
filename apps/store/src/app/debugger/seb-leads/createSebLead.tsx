'use server'

import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { getEnvOrThrow } from '@/utils/getEnvOrThrow'
import { SebDebuggerFormElement } from './constants'

type TransformResult = {
  products: string
  maybeProductSubType: string | undefined
}

const PRODUCT_SUBTYPE_MAP: Record<string, string> = {
  condoInsuranceBrf: 'condoInsurance.condoInsuranceCondominium',
  condoInsuranceRent: 'condoInsurance.condoInsuranceRental',
}

/**
 * Transforms the products list to comply with SEB API requirements.
 *
 * - Consolidates specific condo insurance product types (e.g., 'condoInsuranceBrf', 'condoInsuranceRent') into a single 'condoInsurance' type.
 * - Aggregates corresponding subtypes into the `maybeProductSubType` field.
 * - Ensures that only condo insurance products include subtype details, while all other products remain unchanged without requiring subtypes.
 *
 * This transformation ensures that the product data is formatted as SEB expects.
 *
 * @param products - The original comma-separated list of product types from the form data.
 * @returns An object containing the transformed products string and the aggregated `maybeProductSubType`.
 */
const transformProductsList = (products: FormDataEntryValue | null): TransformResult => {
  if (typeof products !== 'string') {
    console.warn('Invalid products input:', products)
    return { products: '', maybeProductSubType: undefined }
  }

  const productsArray = products.split(',')
  const productSet = new Set<string>()
  const subTypesArray: Array<string> = []

  productsArray.forEach((product) => {
    if (PRODUCT_SUBTYPE_MAP[product]) {
      productSet.add('condoInsurance')
      subTypesArray.push(PRODUCT_SUBTYPE_MAP[product])
    } else {
      productSet.add(product)
    }
  })

  let maybeProductSubType: string | undefined
  if (subTypesArray.length > 0) {
    maybeProductSubType = Array.from(new Set(subTypesArray)).join(',')
  }

  const transformedProducts = Array.from(productSet).join(',')

  return { products: transformedProducts, maybeProductSubType: maybeProductSubType }
}

export const createSebLead = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const ssn = formData.get(SebDebuggerFormElement.SSN) as string
  const firstName = formData.get(SebDebuggerFormElement.FirstName) as string
  const lastName = formData.get(SebDebuggerFormElement.LastName) as string
  const email = formData.get(SebDebuggerFormElement.Email) as string
  const phoneNumber = formData.get(SebDebuggerFormElement.PhoneNumber) as string
  const productList = formData.get(SebDebuggerFormElement.Products)

  const { products, maybeProductSubType } = transformProductsList(productList)

  const parameters = {
    personalNumber: ssn,
    firstName: firstName,
    lastName: lastName,
    contactPhone: phoneNumber,
    contactEmail: email,
    metadata: {
      productType: products as string,
      productSubType: maybeProductSubType,
    },
  }

  console.table(parameters)
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
    productSubType: string | undefined
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
  const API_KEY = getEnvOrThrow('SEB_LEADS_INSURELY_API_KEY')

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
