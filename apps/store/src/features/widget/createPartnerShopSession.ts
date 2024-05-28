import { type ApolloClient } from '@apollo/client'
import type { VariablesOf } from '@graphql-typed-document-node/core'
import { ShopSessionCreatePartnerDocument } from '@/services/graphql/graphql'
import { SearchParam } from './parseSearchParams'

type MutationVariables = VariablesOf<typeof ShopSessionCreatePartnerDocument>['input']

type CreatePartnerShopSessionParams = {
  apolloClient: ApolloClient<unknown>
  searchParams: URLSearchParams
} & Pick<MutationVariables, 'countryCode' | 'partnerName' | 'campaignCode'>

export const createPartnerShopSession = async (
  params: CreatePartnerShopSessionParams,
): Promise<[string, URLSearchParams]> => {
  const [variables, unusedSearchParams] = parseShopSessionCreatePartnerSearchParams(
    params.searchParams,
  )

  if (variables.externalMemberId) {
    console.info(`Widget | Creating Trial Extension Shop Session: ${variables.externalMemberId}`)
  } else {
    console.info(`Widget | Creating Partner Shop Session`)
  }

  const result = await params.apolloClient.mutate({
    mutation: ShopSessionCreatePartnerDocument,
    variables: {
      input: {
        countryCode: params.countryCode,
        partnerName: params.partnerName,
        campaignCode: params.campaignCode,
        initiatedFrom: 'WIDGET',
        ...variables,
      },
    },
  })

  if (!result.data) throw new Error('Failed to create Partner Shop Session')

  return [result.data.shopSessionCreatePartner.id, unusedSearchParams]
}

const parseShopSessionCreatePartnerSearchParams = (
  searchParams: URLSearchParams,
): [Partial<MutationVariables>, URLSearchParams] => {
  const updatedSearchParams = new URLSearchParams(searchParams.toString())

  const externalRequestId = updatedSearchParams.get(SearchParam.ExternalRequestId)
  if (externalRequestId) updatedSearchParams.delete(SearchParam.ExternalRequestId)

  const externalMemberId = updatedSearchParams.get(SearchParam.ExternalMemberId)
  if (externalMemberId) updatedSearchParams.delete(SearchParam.ExternalMemberId)

  return [
    {
      ...(externalRequestId && { partnerRequestId: externalRequestId }),
      ...(externalMemberId && { externalMemberId }),
    },
    updatedSearchParams,
  ]
}
