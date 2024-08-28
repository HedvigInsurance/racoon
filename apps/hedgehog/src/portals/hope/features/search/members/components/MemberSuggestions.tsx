import { Keys, NumberKeys, useDebounce } from '@hedvig-ui'
import { getMemberFlag } from '@hope/features/member/utils'
import {
  EmptyState,
  MemberHistoryCardWrapper,
  MemberHistoryWrapper,
  MemberId,
  MemberName,
} from '@hope/features/members-search/styles'
import { useNavigate } from 'react-router-dom'
import { useMemberNameAndContractMarketInfoQuery } from 'types/generated/graphql'
import { PickedLocale } from '@hope/features/config/constants'
import gql from 'graphql-tag'
import { useCommandLine } from '@hope/features/commands/hooks/use-command-line'
import { Div, Input } from '@hedvig-ui/redesign'
import { useCallback, useEffect, useMemo, useState } from 'react'

gql`
  query MemberNameAndContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
      memberId
      firstName
      lastName
      contractMarketInfo {
        market
        preferredCurrency
      }
      pickedLocale
    }
  }
`

export const MemberSuggestions: React.FC<{
  suggestions: ReadonlyArray<string>
}> = ({ suggestions }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debounceSearchTerm = useDebounce(searchTerm, 300)
  const [memberSearchStrings, setMemberSearchStrings] = useState<string[]>([])

  const registerMemberForSearch = useCallback((searchString: string) => {
    setMemberSearchStrings((prev) =>
      Array.from(new Set([...prev, searchString])),
    )
  }, [])

  const filteredSuggestions = useMemo(() => {
    if (!debounceSearchTerm) {
      return suggestions
    }
    const matchingSearchStrings = memberSearchStrings.filter((searchString) =>
      searchString.toLowerCase().includes(debounceSearchTerm.toLowerCase()),
    )
    return suggestions.filter((memberId) =>
      matchingSearchStrings.some((searchString) =>
        searchString.toLowerCase().includes(memberId.toLowerCase()),
      ),
    )
  }, [memberSearchStrings, debounceSearchTerm, suggestions])
  return (
    <>
      <Div mb="md">
        <Input
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Div>
      <MemberHistoryWrapper>
        {suggestions.length === 0 && (
          <EmptyState>No suggested members yet</EmptyState>
        )}

        {filteredSuggestions.map((memberId, index) => (
          <MemberHistoryCard
            key={memberId}
            memberId={memberId}
            orderNumber={index + 1}
            suggestionsCount={suggestions.length}
            registerMemberForSearch={registerMemberForSearch}
          />
        ))}
      </MemberHistoryWrapper>
    </>
  )
}

const MemberHistoryCard: React.FC<{
  memberId: string
  orderNumber: number
  suggestionsCount: number
  registerMemberForSearch: (name: string) => void
}> = ({ memberId, orderNumber, registerMemberForSearch }) => {
  const { data, loading } = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId },
  })

  const { registerActions, isHintingControl } = useCommandLine()
  const navigate = useNavigate()
  const targetLocation = `/members/${memberId}`

  registerActions([
    {
      label: `Navigate to ${data?.member?.firstName} ${data?.member?.lastName} (${memberId})`,
      keys: [Keys.Control, NumberKeys[orderNumber]],
      onResolve: () => navigate(targetLocation),
    },
  ])

  useEffect(() => {
    registerMemberForSearch(
      `${data?.member?.firstName} ${data?.member?.lastName} ${memberId}`,
    )
  }, [
    data?.member?.firstName,
    data?.member?.lastName,
    loading,
    memberId,
    registerMemberForSearch,
  ])

  return (
    <MemberHistoryCardWrapper
      style={{ position: 'relative' }}
      muted={!data?.member}
      to={targetLocation}
    >
      <MemberName>
        {data?.member?.firstName} {data?.member?.lastName}&nbsp;
        {getMemberFlag(
          data?.member?.contractMarketInfo,
          data?.member?.pickedLocale as PickedLocale | null | undefined,
        )}
        {isHintingControl && <>({orderNumber})</>}
      </MemberName>
      <MemberId>{memberId}</MemberId>
    </MemberHistoryCardWrapper>
  )
}
