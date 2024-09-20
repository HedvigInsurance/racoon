'use server'
import { SebDebuggerFormElement } from '@/app/debugger/seb-leads/constants'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { storefrontLeadsApiRequest } from './storefrontLeadsApiRequest'

export const importAnsSendLeads = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const fromDate = (formData.get(SebDebuggerFormElement.FromDate) as string) + 'T00:00:00Z'
  const toDate = (formData.get(SebDebuggerFormElement.ToDate) as string) + 'T23:59:59Z'

  try {
    const result = await storefrontLeadsApiRequest(
      `/debug/import-leads?from=${fromDate}&to=${toDate}`,
      {
        method: 'POST',
      },
    )

    return {
      messages: (result as { messages: Array<string> }).messages.map((message) => ({
        type: 'success',
        content: message,
      })),
    }
  } catch (err) {
    console.error('Error importing SEB leads sessions', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'

    return {
      errors: {
        generic: [errorMessage],
      },
    }
  }
}
