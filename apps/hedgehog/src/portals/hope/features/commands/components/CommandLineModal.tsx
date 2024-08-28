import styled from '@emotion/styled'
import { FadeIn, FourthLevelHeadline, Input, Paragraph } from '@hedvig-ui'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { useMemberSearch } from '@hope/features/members-search/hooks/use-member-search'
import { useNavigate } from 'react-router-dom'
import { useAdvancedActions } from '../hooks/use-advanced-actions'
import { CommandLineAction } from '@hope/features/commands/hooks/use-command-line'

const CharacterBadge = styled.div`
  background: rgba(0, 0, 0, 0.1);
  padding: 0.35em 0.55em;
  border-radius: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.4em;
`

const ResultItemWrapper = styled.div<{ selected: boolean }>`
  padding: 1em 1em 1em 3.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ selected }) =>
    selected ? 'rgba(0, 0, 0, 0.1)' : 'transparent'};

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const ResultItemContent = styled.div`
  display: flex;
  flex-direction: row;
`

const Wrapper = styled.div`
  position: absolute;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 1);
  box-shadow: -1px -1px 42px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.3em;
  z-index: 103;
`

const CommandLineInput = styled(Input)`
  &&&& {
    width: 40vw;
    min-width: 500px;
    border: none;
    padding-top: 1em;
    padding-bottom: 1em;
  }
`

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const ResultItem: React.FC<{
  action: CommandLineAction
  selected?: boolean
  hide: () => void
}> = ({ action, selected = false, hide }) => {
  return (
    <ResultItemWrapper
      selected={selected}
      onClick={() => {
        action.onResolve()
        hide()
      }}
    >
      <FourthLevelHeadline>{action.label}</FourthLevelHeadline>
      <ResultItemContent>
        {action.keys &&
          action.keys.map(({ hint }) => (
            <CharacterBadge key={hint}>
              <Paragraph style={{ fontSize: '0.8em', fontWeight: 'bold' }}>
                {hint}
              </Paragraph>
            </CharacterBadge>
          ))}
      </ResultItemContent>
    </ResultItemWrapper>
  )
}

export const CommandLineModal: React.FC<{
  hide: () => void
  actions: CommandLineAction[]
}> = ({ hide, actions }) => {
  const navigate = useNavigate()
  const maxActions = 10
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState<CommandLineAction[]>([])

  const { search: memberSearch, members, loading } = useMemberSearch()

  const memberItems = members.map<CommandLineAction>((member) => ({
    label: `${member.firstName} ${member.lastName}`,
    onResolve: () => navigate(`/members/${member.memberId}`),
    keys: [
      { code: 'Member', hint: 'Member' },
      { code: member.memberId, hint: member.memberId },
    ],
  }))

  useEffect(() => {
    if (searchValue.length > 3) {
      memberSearch(searchValue, { pageSize: 10 })
    }
  }, [searchValue, memberSearch])

  useAdvancedActions(searchValue, setSearchValue, setSearchResult, hide)

  useEffect(() => {
    if (searchValue[0] !== '/') {
      setSearchResult(
        actions.filter((item) =>
          item.label.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      )
    }
  }, [searchValue, actions])

  const commands = [...searchResult, ...memberItems].slice(0, maxActions)

  return (
    <Wrapper>
      <SearchWrapper>
        <CommandLineInput
          autoFocus
          value={searchValue}
          size="large"
          loading={loading}
          onChange={({ target }) => {
            const inputValue = (target as HTMLInputElement).value
            const NON_BREAKING_SPACE = '\xa0'

            if (inputValue === NON_BREAKING_SPACE || inputValue === ' ') {
              return
            }

            setSearchValue(inputValue)
          }}
          placeholder="What can I help you with?"
        />
      </SearchWrapper>
      <div>
        {commands.map((action, index) => (
          <FadeIn
            delay={`${index * 40}ms`}
            duration={400}
            key={`${action.label}-${index}`}
          >
            <ResultItem hide={hide} action={action} />
          </FadeIn>
        ))}
      </div>
    </Wrapper>
  )
}
