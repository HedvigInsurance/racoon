import { createApolloClient } from '@/services/apollo'
import {
  CreateQuoteCartDocument,
  CreateQuoteCartMutation,
  CreateQuoteCartMutationVariables,
  QuoteCartStatusQuery,
  QuoteCartStatusQueryVariables,
  QuoteCartStatusDocument,
} from '@/services/apollo/types'
import { Market } from './types'

export namespace QuoteCart {
  const CLIENT = createApolloClient()

  export const COOKIE_KEY = '_hv_onboarding_quote_cart'

  const createQuoteCart = async (variables: CreateQuoteCartMutationVariables) => {
    const { data } = await CLIENT.mutate<CreateQuoteCartMutation, CreateQuoteCartMutationVariables>(
      {
        mutation: CreateQuoteCartDocument,
        variables,
      },
    )

    if (!data) {
      throw new Error('Could not create quote cart')
    }

    return data.onboardingQuoteCart_create.id
  }

  type RenewQuoteCartParams = CreateQuoteCartMutationVariables

  export const renewQuoteCartId = async ({ ...variables }: RenewQuoteCartParams) => {
    const quoteCartId = await createQuoteCart(variables)
    return quoteCartId
  }

  const getQuoteCart = async (id: string) => {
    const { data } = await CLIENT.query<QuoteCartStatusQuery, QuoteCartStatusQueryVariables>({
      query: QuoteCartStatusDocument,
      variables: { id },
    })
    return data.quoteCart
  }

  type ValidateParams = { quoteCartId: string; market: Market }

  export const validate = async ({ quoteCartId, market }: ValidateParams) => {
    const quoteCart = await getQuoteCart(quoteCartId)
    return (quoteCart.market === market && quoteCart.checkout) === null
  }
}
