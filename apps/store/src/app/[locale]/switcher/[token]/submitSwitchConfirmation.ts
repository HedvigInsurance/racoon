'use server'

import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import {
  SwitchConfirmationDocument,
  type SwitchConfirmationMutation,
  type SwitchConfirmationMutationVariables,
} from '@/services/graphql/generated'
import type { RoutingLocale } from '@/utils/l10n/types'
import type { FormStateWithErrors } from 'app/types/formStateTypes'

const DEFAULT_LOCALE: RoutingLocale = 'se-en'

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

  const apolloClient = getApolloClient(DEFAULT_LOCALE)

  try {
    await apolloClient.mutate<SwitchConfirmationMutation, SwitchConfirmationMutationVariables>({
      mutation: SwitchConfirmationDocument,
      variables: { switcherCaseCompleteId: token, currentExpiryDate: expiryDate },
    })
  } catch (error) {
    return {
      errors: {
        generic: ['Something went wrong while submitting!'],
      },
    }
  }

  return {
    messages: [
      {
        type: 'success',
        content: 'Thank you!',
      },
    ],
  }
}
