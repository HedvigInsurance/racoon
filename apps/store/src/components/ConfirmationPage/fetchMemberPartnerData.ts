import { type ApolloClient, isApolloError } from '@apollo/client'
import {
  CurrentMemberDocument,
  type CurrentMemberQuery,
  type CurrentMemberQueryVariables,
} from '@/services/graphql/generated'
import { Features } from '@/utils/Features'

export async function fetchMemberPartnerData(apolloClient: ApolloClient<unknown>) {
  if (!Features.enabled('SAS_PARTNERSHIP')) {
    return null
  }
  try {
    const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
      query: CurrentMemberDocument,
    })
    return data.currentMember.partnerData ?? null
  } catch (err) {
    if (err instanceof Error && isApolloError(err)) {
      console.info('Failed to fetch currentMember', err)
      return null
    } else {
      throw err
    }
  }
}
