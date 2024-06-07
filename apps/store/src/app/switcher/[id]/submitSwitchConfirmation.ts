'use server'

import { initTranslationsServerSide } from '@/app/i18n'
import type { FormStateWithErrors, Message } from '@/app/types/formStateTypes'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import {
  SwitcherCaseCompleteDocument,
  type SwitcherCaseCompleteMutation,
  type SwitcherCaseCompleteMutationVariables,
} from '@/services/graphql/generated'
import { locales } from '@/utils/l10n/locales'
import type { RoutingLocale } from '@/utils/l10n/types'

const DEFAULT_LOCALE: RoutingLocale = locales['sv-SE'].routingLocale

export const submitSwitchConfirmation = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const expiryDate = formData.get('expiryDate') as string
  const id = formData.get('id') as string

  const { t } = await initTranslationsServerSide(DEFAULT_LOCALE)

  if (!expiryDate) {
    return {
      errors: {
        generic: [
          t('SWITCH_CONFIRMATION_FORM_DATE_MISSING', { ns: 'contractSwitchConfirmationForm' }),
        ],
      },
    }
  }

  const apolloClient = getApolloClient(DEFAULT_LOCALE)

  const messages: Array<Message> = []
  const errors: Array<string> = []

  try {
    const { data } = await apolloClient.mutate<
      SwitcherCaseCompleteMutation,
      SwitcherCaseCompleteMutationVariables
    >({
      mutation: SwitcherCaseCompleteDocument,
      variables: { id, currentExpiryDate: expiryDate },
    })

    const { isCompleted } = data?.switcherCaseComplete.switcherCase ?? {}

    if (isCompleted) {
      messages.push({
        type: 'success',
        content: t('SWITCH_CONFIRMATION_FORM_SUCCESS', { ns: 'contractSwitchConfirmationForm' }),
      })
    }

    const userError = data?.switcherCaseComplete.userError?.message

    if (userError) {
      errors.push(userError)
    }
  } catch (error) {
    errors.push(t('SWITCH_CONFIRMATION_FORM_ERROR', { ns: 'contractSwitchConfirmationForm' }))
  }

  return {
    messages,
    errors: {
      generic: errors,
    },
  }
}
