import { useEffect, useState } from 'react'
import * as React from 'react'
import { useSearch } from '@hope/common/hooks/use-search'
import { useMemberHistory } from '@hope/common/hooks/use-member-history'
import { SearchInput } from '@hope/features/search/components/SearchInput'
import {
  Button,
  fadeIn,
  Flex,
  MainHeadline,
  Spacing,
  StandaloneMessage,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
} from '@hedvig-ui'
import { ExtraInstruction } from '@hope/features/members-search/styles'
import { MemberSuggestions } from '@hope/features/search/members/components/MemberSuggestions'
import styled from '@emotion/styled'
import { MemberHitRow } from '@hope/features/search/members/components/MemberHitRow'
import { useNameAutoComplete } from '@hope/features/search/members/hooks/use-name-autocomplete'
import { SearchCategoryButtons } from '@hope/features/search/components/SearchCategoryButtons'
import { useNavigate } from 'react-router-dom'
import { Instructions } from '@hope/features/search/components/Instructions'
import { MemberSearchHit } from 'types/generated/graphql'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'
import { LoaderIcon } from 'react-hot-toast'
const MemberSuggestionsWrapper = styled(Instructions)`
  padding-top: 20vh;
  width: 100%;
  max-width: 50rem;
  animation: ${fadeIn(1)} 1000ms forwards;
  animation-delay: 250ms;
`

export const MemberSearch: React.FC<{ query: string | null }> = ({
  query: defaultQuery,
}) => {
  const { hasPermission: hasSearchCarMembersPermission } =
    useHasPermission('searchCarMembers')

  const navigate = useNavigate()
  const [query, setQuery] = useState(defaultQuery ?? '')

  const { hits, loading, search, fetchMore, hasMore } =
    useSearch<MemberSearchHit>(query, {
      type: hasSearchCarMembersPermission ? 'CAR_MEMBERS' : 'MEMBERS',
    })
  const [luckySearch, setLuckySearch] = useState(false)

  const { memberHistory } = useMemberHistory()
  const { suggestionString } = useNameAutoComplete(query)

  useEffect(() => {
    if (query !== '')
      search({
        type: hasSearchCarMembersPermission ? 'CAR_MEMBERS' : 'MEMBERS',
      })
  }, [query, search, hasSearchCarMembersPermission])

  useEffect(() => {
    if (hits.length === 1 || (luckySearch && hits.length)) {
      navigate(`/members/${hits[0].hit.memberId}`)
    }
  }, [luckySearch, hits, navigate, hasMore])

  const luckySearchHandler = async () => {
    if (!query) {
      return
    }

    setLuckySearch(true)

    search({
      type: hasSearchCarMembersPermission ? 'CAR_MEMBERS' : 'MEMBERS',
    })
  }

  return (
    <>
      <SearchInput
        onChange={(value) => setQuery(value)}
        onSearch={() => {
          navigate(`/search/members?query=${query}`)
        }}
        loading={loading}
        suggestion={suggestionString}
        defaultValue={query}
        luckySearchHandler={luckySearchHandler}
      />

      <SearchCategoryButtons
        category="members"
        onChange={(category) => navigate(`/search/${category}?query=${query}`)}
      />

      <Spacing top="large" />

      {hits.length !== 0 && (
        <>
          <Table>
            <TableHeader>
              <TableHeaderColumn>Member</TableHeaderColumn>
              <TableHeaderColumn>Signed Up</TableHeaderColumn>
              <TableHeaderColumn>First Master Inception</TableHeaderColumn>
              <TableHeaderColumn>Last Termination Date</TableHeaderColumn>
              <TableHeaderColumn>Contracts</TableHeaderColumn>
            </TableHeader>
            <TableBody>
              {hits.map((member, index) => (
                <MemberHitRow
                  key={member.hit.memberId}
                  result={member}
                  index={index}
                  length={hits.length}
                  topElement="Search Input"
                />
              ))}
            </TableBody>
          </Table>
          {hits.length >= 10 && (
            <>
              <Spacing top="medium" />
              <Flex justify="center">
                {loading ? (
                  <LoaderIcon />
                ) : (
                  <Button
                    disabled={!hasMore}
                    variant="secondary"
                    onClick={() => {
                      fetchMore()
                    }}
                  >
                    {hasMore ? 'Show more' : 'No more results'}
                  </Button>
                )}
              </Flex>
            </>
          )}
        </>
      )}
      {hits.length === 0 && query && (
        <StandaloneMessage>No results</StandaloneMessage>
      )}
      {hits.length === 0 && !query && (
        <div>
          <Instructions>
            <h1>Search for members</h1>
            <div>
              Search for anything related to a member, such as
              <br />
              <code>name</code>, <code>member ID</code>, <code>SSN</code>,{' '}
              <code>email</code>, <code>phone</code>, <code>claim notes</code>{' '}
              <br />
              <code>claim payment notes</code>, <code>street</code>,{' '}
              <code>postal code</code>, <code>city</code>, <code>messages</code>
            </div>
            {query && (
              <ExtraInstruction>Press enter to search</ExtraInstruction>
            )}
          </Instructions>

          <MemberSuggestionsWrapper>
            <MainHeadline style={{ marginBottom: '1rem' }}>
              Suggestions
            </MainHeadline>
            <MemberSuggestions suggestions={memberHistory} />
          </MemberSuggestionsWrapper>
        </div>
      )}
    </>
  )
}
