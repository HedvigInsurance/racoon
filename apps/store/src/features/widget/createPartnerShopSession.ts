import { type ApolloClient } from '@apollo/client'
import { type VariablesOf } from '@graphql-typed-document-node/core'
import { graphql } from '@/services/graphql'
import { WidgetFlowType } from '@/services/storyblok/storyblok'
import { SearchParam } from './parseSearchParams'

const ShopSessionCreatePartnerDocument = graphql(/* GraphQL */ `
  mutation ShopSessionCreatePartner($input: ShopSessionCreatePartnerInput!) {
    shopSessionCreatePartner(input: $input) {
      id
    }
  }
`)

type MutationVariables = VariablesOf<typeof ShopSessionCreatePartnerDocument>['input']

type CreatePartnerShopSessionParams = {
  apolloClient: ApolloClient<unknown>
  flowType: WidgetFlowType
  searchParams: URLSearchParams
} & Pick<MutationVariables, 'countryCode' | 'partnerName' | 'campaignCode'>

export const createPartnerShopSession = async (
  params: CreatePartnerShopSessionParams,
): Promise<[string, URLSearchParams]> => {
  const [variables, unusedSearchParams] = parseShopSessionCreatePartnerSearchParams(
    params.searchParams,
  )
  if (params.flowType === WidgetFlowType.HomeTrialExtension) {
    if (variables.externalMemberId == null) {
      throw new Error(`externalMemberId is required for trial extension flow`)
    }
  } else {
    if (variables.externalMemberId != null) {
      console.log('Removing externalMemberId from non-trial widget flow')
    }
    delete variables.externalMemberId
  }
  console.log(
    `Widget | Creating partner shopSession, flowType=${params.flowType}, variables=${JSON.stringify(variables)}`,
  )

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
