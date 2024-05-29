'use server'

import { initTranslationsServerSide } from '@/app/i18n'
import type { FormStateWithErrors } from '@/app/types/formStateTypes'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import {
  SwitchConfirmationDocument,
  type SwitchConfirmationMutation,
  type SwitchConfirmationMutationVariables,
} from '@/services/graphql/generated'
import type { RoutingLocale } from '@/utils/l10n/types'

const DEFAULT_LOCALE: RoutingLocale = 'se-en'

export const submitSwitchConfirmation = async (
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> => {
  const expiryDate = formData.get('expiryDate') as string
  const id = formData.get('id') as string
  const locale = formData.get('locale') as string

  const { t } = await initTranslationsServerSide(locale)

  if (!expiryDate) {
    return {
      errors: {
        generic: [t('contractSwitchConfirmationForm:SWITCH_CONFIRMATION_FORM_DATE_MISSING')],
      },
    }
  }

  const apolloClient = getApolloClient(DEFAULT_LOCALE)

  try {
    await apolloClient.mutate<SwitchConfirmationMutation, SwitchConfirmationMutationVariables>({
      mutation: SwitchConfirmationDocument,
      variables: { switcherCaseCompleteId: id, currentExpiryDate: expiryDate },
    })
  } catch (error) {
    return {
      errors: {
        generic: [t('contractSwitchConfirmationForm:SWITCH_CONFIRMATION_FORM_ERROR')],
      },
    }
  }

  return {
    messages: [
      {
        type: 'success',
        content: t('contractSwitchConfirmationForm:SWITCH_CONFIRMATION_FORM_SUCCESS'),
      },
    ],
  }
}
