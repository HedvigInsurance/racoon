import { useEffect, useState } from 'react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@hope/common/hooks/use-search'
import { SearchInput } from '@hope/features/search/components/SearchInput'
import { SearchCategoryButtons } from '@hope/features/search/components/SearchCategoryButtons'
import { Button, Flex, Spacing, StandaloneMessage } from '@hedvig-ui'
import {
  ExtraInstruction,
  Instructions,
} from '@hope/features/search/components/Instructions'
import { ShopSessionSearchHit } from 'types/generated/graphql'
import { ShopSessionSearchResult } from '@hope/features/search/shopSessions/components/ShopSessionResult'

export const ShopSessionSearch: React.FC<{ query: string | null }> = ({
  query: defaultQuery,
}) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState(defaultQuery ?? '')
  const [hasSearched, setHasSearched] = useState(false)
  const { hits, loading, search, fetchMore } = useSearch<ShopSessionSearchHit>(
    query,
    {
      type: 'SHOP_SESSIONS',
    },
  )

  useEffect(() => {
    setHasSearched(false)
  }, [query])

  useEffect(() => {
    if (query !== '') search()
  }, [query, search])
  return (
    <>
      <SearchInput
        onChange={(value) => setQuery(value)}
        onSearch={() => {
          navigate(`/search/shop_sessions?query=${query}`)
          setHasSearched(true)
        }}
        loading={loading}
        defaultValue={defaultQuery ?? ''}
      />

      <SearchCategoryButtons
        category="shop_sessions"
        onChange={(category) => navigate(`/search/${category}?query=${query}`)}
      />

      <Spacing top="large" />
      {hits.length !== 0 &&
        hits.map((hit) => (
          <ShopSessionSearchResult key={hit.hit.id} shopSession={hit.hit} />
        ))}

      {hits.length === 0 && query && hasSearched && (
        <StandaloneMessage>No results</StandaloneMessage>
      )}

      {hits.length !== 0 && hits.length >= 10 && (
        <Flex justify="center">
          <Button
            disabled={loading}
            variant="tertiary"
            onClick={() => fetchMore()}
          >
            Show more
          </Button>
        </Flex>
      )}
      {hits.length === 0 && !query && (
        <div>
          <Instructions>
            <h1>Search for shop sessions</h1>
            <div>
              Search for things related to a shop session, such as
              <br />
              <code>name</code>, <code>SSN</code>, <code>email</code>,{' '}
              <code>member id</code>
            </div>
            {query && (
              <ExtraInstruction>Press enter to search</ExtraInstruction>
            )}
          </Instructions>
        </div>
      )}
    </>
  )
}
