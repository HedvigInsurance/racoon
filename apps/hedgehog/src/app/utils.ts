import { FormStateWithErrors } from './types/formStateTypes'

export function extractFormStateErrors(state: FormStateWithErrors) {
  const genericErrorMessages = state?.errors?.generic || []
  const fieldsErrorMessages = Object.values(state?.errors?.fields || {})

  return [...fieldsErrorMessages, ...genericErrorMessages]
}
