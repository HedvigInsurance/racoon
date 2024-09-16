'use server'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { storefrontLeadsApiRequest } from './storefrontLeadsApiRequest'

export const generateAndSendOffer = async (
): Promise<FormStateWithErrors> => {
  try {
    const result = await storefrontLeadsApiRequest(`/debug/generate-and-send-offer`, {
      method: 'POST',
    })
    return {
      messages: (result as { messages: Array<string> }).messages.map((message) => ({
        type: 'success',
        content: message,
      })),
    }
  } catch (err) {
    console.error('Error generating widget session', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'

    return {
      errors: {
        generic: [errorMessage],
      },
    }
  }
}
