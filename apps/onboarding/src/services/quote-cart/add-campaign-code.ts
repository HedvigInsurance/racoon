import type {
  AddCampaignCodeMutation,
  AddCampaignCodeMutationVariables,
} from '@/services/apollo/types'
import { AddCampaignCodeDocument } from '@/services/apollo/types'
import { GraphQLClient } from './types'

export type AddCampaignCodeParams = {
  client: GraphQLClient
  id: string
  code: string
}

export const addCampaignCode = async ({ client, id, code }: AddCampaignCodeParams) => {
  const result = await client.mutate<AddCampaignCodeMutation, AddCampaignCodeMutationVariables>({
    mutation: AddCampaignCodeDocument,
    variables: { id, code },
  })

  if (!result.data) return null

  if (result.data.quoteCart_addCampaign.__typename === 'QuoteCart') {
    return result.data.quoteCart_addCampaign.campaign ?? null
  }

  // campaign code not valid
  return null
}
