import { ArrayElement } from '@hedvig-ui'
import { useSearch, UseSearchResult } from '@hope/common/hooks/use-search'
import { useEffect } from 'react'
import { MemberSearchHit } from 'types/generated/graphql'

interface UseNameAutocompleteResult {
  suggestion: ArrayElement<UseSearchResult<MemberSearchHit>['hits']> | null
  suggestionString: string
}

export const useNameAutoComplete = (
  query: string,
): UseNameAutocompleteResult => {
  const { hits, search } = useSearch<MemberSearchHit>(query, {
    type: 'FULL_NAME',
  })

  useEffect(() => search(), [query, search])

  const suggestion =
    hits.find(({ hit }) =>
      `${hit.firstName} ${hit.lastName}`
        .toLowerCase()
        .startsWith(query.toLowerCase()),
    ) ?? null

  const suggestionString = () => {
    if (!query) return ''
    if (!suggestion?.hit?.firstName || !suggestion?.hit?.lastName) return ''

    const completeString = `${suggestion.hit.firstName} ${suggestion.hit.lastName}`

    return query + completeString.substring(query.length)
  }

  return { suggestion, suggestionString: suggestionString() }
}
