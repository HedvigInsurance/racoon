import { useMemo } from 'react'
import {
  MemberSearchLazyQueryHookResult,
  MemberSearchOptions,
  MemberSearchResult,
  useMemberSearchLazyQuery,
} from 'types/generated/graphql'

type MemberSearchReturnTuple = [
  MemberSearchResult,
  (query: string, options?: MemberSearchOptions) => void,
  MemberSearchLazyQueryHookResult[1],
]

export const useOldMemberSearch = (): MemberSearchReturnTuple => {
  const [memberSearchQuery, queryResult] = useMemberSearchLazyQuery()

  const memberSearch = (query: string, options?: MemberSearchOptions) => {
    memberSearchQuery({
      variables: {
        query,
        options: {
          pageSize: options?.pageSize ?? 25,
        },
      },
    })
  }

  const members = useMemo(
    () => queryResult?.data?.memberSearch.members ?? [],
    [queryResult?.data?.memberSearch.members],
  )
  const memberSearchResult = {
    members,
  }

  return [memberSearchResult as MemberSearchResult, memberSearch, queryResult]
}
