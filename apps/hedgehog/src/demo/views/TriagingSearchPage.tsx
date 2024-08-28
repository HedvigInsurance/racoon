import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import {
  ChevronRight,
  Search as SearchIcon,
  XCircleFill,
} from 'react-bootstrap-icons'
import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import chroma from 'chroma-js'
import { motion } from 'framer-motion'
import gql from 'graphql-tag'
import {
  EntrypointSearchResponseFragment,
  useSearchEntrypointsLazyQuery,
} from 'types/generated/graphql'
import { useDebounce } from '@hedvig-ui'

const StyledInput = styled(Input)`
  border: none;
  font-size: 1.25rem;

  width: calc(100% - 1.5rem);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 1rem;
  padding: 0 1.2rem;
`

const CloseIcon = styled(XCircleFill)`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  position: absolute;
  width: 1.5rem;
  height: 1.5rem;

  top: calc(50% - 0.75rem);
  right: 0.75rem;

  fill: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(2).hex()};
`

const SearchHitRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  padding: 1rem 0;
  user-select: none;
`

gql`
  query SearchClaimType($query: String!) {
    searchClaimType(query: $query) {
      claimType
      score
    }
  }

  query SearchEntrypoints(
    $type: String!
    $searchString: String
    $acceptLanguage: String!
    $limit: Int
  ) {
    searchEntrypoints(
      type: $type
      searchString: $searchString
      acceptLanguage: $acceptLanguage
      limit: $limit
    ) {
      ...EntrypointSearchResponse
    }
  }

  fragment EntrypointSearchResponse on EntrypointSearchResponse {
    id
    displayName
  }
`

const useSearchEntrypoints = (searchString: string) => {
  const [entrypoints, setEntrypoints] = useState<
    EntrypointSearchResponseFragment[]
  >([])
  const [search, { refetch, data }] = useSearchEntrypointsLazyQuery()

  useEffect(() => {
    if (!searchString) setEntrypoints([])
  }, [searchString])

  const searchHandler = () => {
    if (entrypoints.length === 0) {
      // Lovely bug, need to refetch after first search
      search({
        variables: {
          type: 'CLAIM',
          searchString,
          acceptLanguage: 'SV_SE',
          limit: 10,
        },
      })
      return
    }

    refetch({
      type: 'CLAIM',
      searchString,
      acceptLanguage: 'SV_SE',
      limit: 10,
    })
  }

  useEffect(() => {
    if (data?.searchEntrypoints)
      setEntrypoints(
        data.searchEntrypoints as EntrypointSearchResponseFragment[],
      )
  }, [data])

  return { search: searchHandler, hits: entrypoints }
}

export const TriagingSearchPage: React.FC<{
  onSelect: (option: string) => void
}> = ({ onSelect }) => {
  const [searchString, setSearchString] = useState('')
  const { search, hits } = useSearchEntrypoints(searchString)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedValue = useDebounce(searchString, 100)

  useEffect(() => {
    search()
  }, [debouncedValue, search])

  return (
    <div style={{ padding: '0 1.25rem' }}>
      <InputContainer>
        <StyledInput
          value={searchString}
          ref={inputRef}
          onChange={(e) => setSearchString(e.currentTarget.value)}
          placeholder="What happened?"
          size="large"
          icon={<SearchIcon />}
        />
        {searchString && (
          <CloseIcon
            onClick={() => {
              setSearchString('')
              inputRef.current?.focus()
            }}
          />
        )}
      </InputContainer>
      <ResultContainer>
        {hits.map(({ id, displayName }) => (
          <SearchHitRow
            key={id}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              onSelect(displayName)
            }}
          >
            <div>{displayName}</div>
            <ChevronRight />
          </SearchHitRow>
        ))}
      </ResultContainer>
    </div>
  )
}
