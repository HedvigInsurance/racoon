'use server'

import {SEBFormElement} from "@/app/debugger/seb-leads/types";
import type { FormStateWithErrors } from '@/app/types/formStateTypes'

const INSURELY_API_URL = 'https://api.insurely.com/sessions' // Add this url to secrets
const INSURELY_API_KEY = 'XXXXXXXXXXXXX' // Add this key to secrets

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
        metadata : {
            productType: product
        }
    }
    console.log('Creating SEB lead with parameters:', parameters)
    console.table(parameters)

    let sebSessionId: string|null

    try {
        const result = await createSebLeadStaging(parameters)
        sebSessionId = result.sessionId
    } catch (error) {
        console.error('Error creating car trial', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return {
            errors: {
                generic: [errorMessage],
            },
        }
    }

    if (sebSessionId) {
        console.log(`created a lead with the session is  ${sebSessionId}`)
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
    const url = new URL(INSURELY_API_URL)
    const headers = new Headers(
        {
            'Content-Type': 'application/json',
            'Authorization-token': INSURELY_API_KEY,
        }
    )

    const body = JSON.stringify(params)

    console.debug(`Creating SEB lead for ${params.personalNumber}`)
    console.table(body)

    const response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: headers,
    })

    if (!response.ok) {
        const json = (await response.json()) as CreateSebLeadsResponse
        throw new Error(`${json.errorCode}: ${json.errorMessage ?? 'Unknown error'}`)
    }

    return (await response.json()) as CreateSebLeadsResponse
}