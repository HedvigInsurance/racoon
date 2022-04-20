import { Fields } from 'formidable'
import { getLocale } from '@/lib/l10n'
import { LocaleLabel } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/page-link'
import { createApolloClient } from '@/services/apollo'
import {
  CreateQuoteBundleDocument,
  CreateQuoteBundleMutation,
  CreateQuoteBundleMutationVariables,
  CreateQuoteCartDocument,
  CreateQuoteCartMutation,
  CreateQuoteCartMutationVariables,
} from '@/services/apollo/types'
import { EntryPoint, InputField } from './StartPage.constants'
import { isEntryPoint } from './StartPage.helpers'

const client = createApolloClient()

const isLocale = (locale: unknown): locale is LocaleLabel => {
  return typeof locale === 'string'
}

const createQuoteCart = async (variables: CreateQuoteCartMutationVariables) => {
  const { data } = await client.mutate<CreateQuoteCartMutation, CreateQuoteCartMutationVariables>({
    mutation: CreateQuoteCartDocument,
    variables,
  })

  if (!data) {
    throw new Error('Could not create quote cart')
  }

  return data.onboardingQuoteCart_create
}

const createSwedishQuoteBundle = async (variables: CreateQuoteBundleMutationVariables) => {
  const { data } = await client.mutate<
    CreateQuoteBundleMutation,
    CreateQuoteBundleMutationVariables
  >({
    mutation: CreateQuoteBundleDocument,
    variables,
  })

  if (!data) {
    throw new Error('Could not create quote bundle')
  }

  if (data.quoteCart_createSwedishBundle.__typename === 'QuoteBundleError') {
    throw new Error('Error creating quote bundle')
  }

  return data.quoteCart_createSwedishBundle
}

type Result = { type: 'ERROR'; json: Record<string, string> } | { type: 'SUCCESS'; url: string }

export const handleStartPageForm = async (formData: Fields): Promise<Result> => {
  const {
    [InputField.EntryPoint]: entryPoint,
    [InputField.PersonalNumber]: personalNumber,
    [InputField.Locale]: locale,
  } = formData

  if (!isEntryPoint(entryPoint) || !isLocale(locale)) {
    return { type: 'ERROR', json: { form: 'GENERIC_ERROR_INPUT_REQUIRED' } }
  }

  const { path, isoLocale, apiMarket } = getLocale(locale)

  if (entryPoint === EntryPoint.Current) {
    if (typeof personalNumber !== 'string') {
      return {
        type: 'ERROR',
        json: { [InputField.PersonalNumber]: 'GENERIC_ERROR_INPUT_REQUIRED' },
      }
    }

    try {
      const quoteCart = await createQuoteCart({
        market: apiMarket,
        locale: isoLocale,
      })
      const quoteCartId = quoteCart.id

      await createSwedishQuoteBundle({
        id: quoteCartId,
        input: { ssn: personalNumber.replace('-', ''), isStudent: false },
      })

      return {
        type: 'SUCCESS',
        url: PageLink.old_offer({ locale: path, quoteCartId, showEdit: true }),
      }
    } catch (error) {
      console.warn(error)
      return {
        type: 'SUCCESS',
        url: PageLink.old_onboarding_se_needer({ locale: path }),
      }
    }
  }

  switch (entryPoint) {
    case EntryPoint.New:
      return {
        type: 'SUCCESS',
        url: PageLink.old_onboarding_se_needer({ locale: path }),
      }

    case EntryPoint.Switch:
      return {
        type: 'SUCCESS',
        url: PageLink.old_onboarding_se_switcher({ locale: path }),
      }
  }
}
