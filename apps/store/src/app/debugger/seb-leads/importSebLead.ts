'use server'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { getFormValueOrThrow } from '@/utils/getFormValueOrTrrow'
import { SebDebuggerFormElement } from './constants'
import { storefrontLeadsApiRequest } from './storefrontLeadsApiRequest'

export const importSebLead = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  try {
    const sebInsurelyId = getFormValueOrThrow(formData, SebDebuggerFormElement.SebInsurelyId)
    const result = await storefrontLeadsApiRequest(`/debug/leads/${sebInsurelyId}`, { method: 'POST' })
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
