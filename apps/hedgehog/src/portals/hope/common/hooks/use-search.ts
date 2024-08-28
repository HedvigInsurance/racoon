import gql from 'graphql-tag'
import {
  SearchHit,
  SearchQueryVariables,
  SearchResultHighlight,
  useSearchLazyQuery,
} from 'types/generated/graphql'
import { useCallback, useState } from 'react'
import { PushUserAction } from '@hope/features/tracking/utils/tags'

gql`
  query Search($query: String!, $type: String!, $from: Int, $size: Int) {
    search(query: $query, type: $type, from: $from, size: $size) {
      highlights {
        field
        values
      }
      hit {
        ... on MemberSearchHit {
          id
          memberId
          firstName
          lastName
        }
        ... on NoteSearchHit {
          id
          memberId
          firstName
          lastName
          claimId
          text
          author
        }
        ... on QuoteSearchHit {
          id
          memberId
          ssn
          fullName
          street
          postalCode
          city
        }
        ... on QuoteCartSearchHit {
          id
          quotes {
            id
            memberId
            ssn
            fullName
            street
            postalCode
            city
          }
        }

        ... on ShopSessionSearchHit {
          id
          ssn
          memberId
          email
          fullName
        }
      }
    }
  }
`

interface GenericSearchResult<T> {
  highlights: SearchResultHighlight[]
  hit: T
}

export interface UseSearchResult<T> {
  hits: GenericSearchResult<T>[]
  loading: boolean
  hasMore: boolean
  search: (options?: SearchQueryOptions) => void
  fetchMore: (amount?: number, options?: SearchQueryOptions) => void
}

type SearchQueryOptions = Omit<SearchQueryVariables, 'query'>

export const useSearch = <T extends SearchHit>(
  query: string,
  baseOptions?: SearchQueryOptions,
): UseSearchResult<T> => {
  const baseAmount = baseOptions?.size ?? 10

  const [result, setResult] = useState<GenericSearchResult<T>[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [nextResult, setNextResult] = useState<GenericSearchResult<T>[]>([])
  const [search, { loading, refetch, fetchMore }] = useSearchLazyQuery({
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'cache-first',
  })

  const getOptions = useCallback(
    (options?: SearchQueryOptions): SearchQueryOptions => ({
      from: options?.from ?? baseOptions?.from,
      size: options?.size ?? baseOptions?.size,
      type: options?.type ?? baseOptions?.type ?? 'MEMBERS',
    }),
    [baseOptions?.from, baseOptions?.size, baseOptions?.type],
  )

  const prefetchHandler = useCallback(
    (options?: SearchQueryOptions) => {
      fetchMore({
        variables: {
          ...getOptions(options),
          from: result.length,
          size: baseAmount,
        },
      }).then((res) => {
        if (res.data?.search) {
          setNextResult(res.data.search as GenericSearchResult<T>[])
          setHasMore(res.data.search.length >= result.length)
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getOptions, query, search],
  )

  const searchHandler = useCallback(
    (options?: SearchQueryOptions) => {
      if (loading) return

      setHasMore(true)
      search({
        variables: {
          query,
          ...getOptions(options),
        },
      }).then((res) => {
        if (res.data?.search) {
          PushUserAction(baseOptions?.type ?? 'MEMBERS', 'search', null, 'new')
          setResult(res.data.search as GenericSearchResult<T>[])
          setHasMore(res.data.search.length > 0)
          prefetchHandler()
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getOptions, query, search],
  )

  const fetchMoreHandler = (amount?: number, options?: SearchQueryOptions) => {
    if (loading) return
    if (nextResult.length > 0) {
      const combinedResult = result.concat(nextResult)
      setResult([...new Set(combinedResult)])
      setNextResult([])
      return
    }
    if (!hasMore) return
    refetch({
      query,
      ...getOptions(options),
      size: result.length + (amount ?? baseAmount),
    })
    setHasMore(true)
  }

  return {
    hits: result,
    loading,
    hasMore: hasMore || nextResult.length > 0,
    search: searchHandler,
    fetchMore: fetchMoreHandler,
  }
}
