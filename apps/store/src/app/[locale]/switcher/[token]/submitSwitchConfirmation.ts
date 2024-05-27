'use server'

import type { FormStateWithErrors } from 'app/types/formStateTypes'

export const submitSwitchConfirmation = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const expiryDate = formData.get('expiryDate') as string
  const token = formData.get('token') as string

  if (!expiryDate) {
    return {
      errors: {
        generic: ['Make sure to select an expiration date'],
      },
    }
  }

  console.log({ expiryDate, token })

  // Make TS happy
  await Promise.resolve()

  return {
    fields: { expiryDate, token },
  }
}
