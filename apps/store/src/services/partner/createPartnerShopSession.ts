import { ApolloClient } from '@apollo/client'
import {
  PartnerWidgetInitDocument,
  PartnerWidgetInitMutation,
  PartnerWidgetInitMutationVariables,
} from '@/services/apollo/generated'

export const createPartnerShopSession = async (
  apolloClient: ApolloClient<unknown>,
  variables: PartnerWidgetInitMutationVariables['input'],
): Promise<PartnerWidgetInitMutation['partnerWidgetInit']> => {
  const response = await apolloClient.mutate<
    PartnerWidgetInitMutation,
    PartnerWidgetInitMutationVariables
  >({
    mutation: PartnerWidgetInitDocument,
    variables: { input: variables },
  })

  if (!response.data) {
    const errors = response.errors?.map((error) => error.message).join('\n')
    throw new Error(errors)
  }

  return response.data.partnerWidgetInit
}
