import gql from 'graphql-tag'
import {
  ExtensiveMemberSearchQuery,
  MemberSearchOptions,
  SlimMemberSearchQuery,
  useExtensiveMemberSearchLazyQuery,
  useSlimMemberSearchLazyQuery,
} from 'types/generated/graphql'
import { ApolloError } from '@apollo/client'
import { useCallback, useState } from 'react'

gql`
  query SlimMemberSearch($query: String!, $options: MemberSearchOptions!) {
    memberSearch(query: $query, options: $options) {
      members {
        memberId
        firstName
        lastName
      }
    }
  }

  query ExtensiveMemberSearch($query: String!, $options: MemberSearchOptions!) {
    memberSearch(query: $query, options: $options) {
      members {
        memberId
        firstName
        lastName
        status
        signedOn
        birthDate
        contractMarketInfo {
          market
          preferredCurrency
        }
        contracts {
          status
          masterInception
          terminationDate
        }
      }
    }
  }
`

export type UseMemberSearchMembers =
  | ExtensiveMemberSearchQuery['memberSearch']['members']
  | SlimMemberSearchQuery['memberSearch']['members']

interface UseMemberSearchResult {
  members: UseMemberSearchMembers
  search: (query: string, options?: MemberSearchOptions) => void
  loading: boolean
  error?: ApolloError
}

const defaultOptions: MemberSearchOptions = {
  pageSize: 25,
}

export const useMemberSearch = (slim = true): UseMemberSearchResult => {
  const [members, setMembers] = useState<UseMemberSearchResult['members']>([])
  const [extensiveMemberSearch, extensiveResponse] =
    useExtensiveMemberSearchLazyQuery()
  const [slimMemberSearch, slimResponse] = useSlimMemberSearchLazyQuery()

  const memberSearch = slim ? slimMemberSearch : extensiveMemberSearch
  const response = slim ? slimResponse : extensiveResponse

  const search = useCallback(
    (query: string, options?: MemberSearchOptions) => {
      memberSearch({
        variables: {
          query,
          options: { ...defaultOptions, ...options },
        },
      }).then(({ data }) => setMembers(data?.memberSearch?.members ?? []))
    },
    [memberSearch],
  )

  const error = response.error
  const loading = response.loading

  return { members, search, error, loading }
}
