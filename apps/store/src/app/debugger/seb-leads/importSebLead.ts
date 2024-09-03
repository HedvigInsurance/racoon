'use server'
import { SebDebuggerFormElement } from '@/app/debugger/seb-leads/constants'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { getFormValueOrThrow } from '@/utils/getFormValueOrTrrow'

export const importSebLead = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  try {
    const headers = new Headers()
    headers.set(
      'Authorization',
      'Basic ' +
        Buffer.from(
          `${getEnvOrThrow('SEB_LEADS_STOREFRONT_API_USERNAME')}:${getEnvOrThrow('SEB_LEADS_STOREFRONT_API_PASSWORD')}`,
          'utf-8',
        ).toString('base64'),
    )
    const sebInsurelyId = getFormValueOrThrow(formData, SebDebuggerFormElement.SebInsurelyId)
    const response = await fetch(
      `${getEnvOrThrow('SEB_LEADS_STOREFRONT_API_URL')}/leads/${sebInsurelyId}`,
      { method: 'POST', headers },
    )
    const result = await response.json()
    console.debug('API response', result)
    if (!response.ok) {
      throw new Error(`${result.status}: ${result.error ?? 'Unknown error'}`)
    }
    return {
      messages: (result as { messages: Array<string> }).messages.map((message) => ({
        type: 'success',
        content: message,
      })),
    }
  } catch (err) {
    console.error('Error creating SEB lead', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'

    return {
      errors: {
        generic: [errorMessage],
      },
    }
  }
}

const getEnvOrThrow = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} not configured`)
  }
  return value
}
