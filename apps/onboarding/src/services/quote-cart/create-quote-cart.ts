import type {
  CreateQuoteCartMutationVariables,
  CreateQuoteCartMutation,
} from '@/services/apollo/types'
import { CreateQuoteCartDocument } from '@/services/apollo/types'
import type { GraphQLClient } from './types'

export type CreateQuoteCartParams = { client: GraphQLClient } & CreateQuoteCartMutationVariables

export const createQuoteCart = async ({ client, ...variables }: CreateQuoteCartParams) => {
  const { data } = await client.mutate<CreateQuoteCartMutation, CreateQuoteCartMutationVariables>({
    mutation: CreateQuoteCartDocument,
    variables,
  })

  if (!data) {
    throw new Error('Could not create quote cart')
  }

  return data.onboardingQuoteCart_create.id
}
