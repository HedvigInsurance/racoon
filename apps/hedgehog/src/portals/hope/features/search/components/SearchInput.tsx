import styled from '@emotion/styled'
import { Input, Button, Flex } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui'
import { SearchIcon } from '@hope/features/members-search/styles'
import { useRef, useState } from 'react'
import * as React from 'react'
import { CommandHotkey } from '../../commands/components/CommandHotkey'
import { paddingMap } from '@hedvig-ui/Card/card'

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  padding: ${paddingMap.small} 0;
`

const SuggestionText = styled.div`
  font-size: 18px;
  font-family: inherit;
  letter-spacing: 0.01px;
  opacity: 0.25;
  pointer-events: none;

  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  padding-left: 41px;

  overflow: hidden;
  white-space: nowrap;
`

export const SearchInput: React.FC<{
  onChange: (query: string) => void
  onSearch: (query: string) => void
  luckySearchHandler?: () => void
  loading?: boolean
  suggestion?: string
  defaultValue?: string
}> = ({
  onSearch,
  onChange,
  loading,
  suggestion = '',
  defaultValue = '',
  luckySearchHandler,
}) => {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <SearchInputContainer>
        <Input
          ref={inputRef}
          style={{
            position: 'relative',
            maxWidth: '50rem',
            width: '100%',
            zIndex: '1',
          }}
          onChange={(e) => {
            setValue(e.currentTarget.value)
            onChange(e.currentTarget.value)
          }}
          value={value}
          size="large"
          muted={!value}
          placeholder="What are you looking for?"
          icon={<SearchIcon muted={!value} />}
          loading={loading}
          autoFocus
          onKeyDown={(e) => {
            if (
              isPressing(e, Keys.Enter) &&
              e.metaKey &&
              e.shiftKey &&
              luckySearchHandler
            ) {
              e.preventDefault()
              luckySearchHandler()
              return
            }

            if (
              isPressing(e, Keys.Enter) ||
              (isPressing(e, Keys.Enter) && e.metaKey)
            ) {
              e.preventDefault()
              onSearch(e.currentTarget.value)
            }

            if (
              isPressing(e, Keys.Right) &&
              suggestion &&
              suggestion !== value
            ) {
              e.preventDefault()
              setValue(suggestion)
            }

            if (isPressing(e, Keys.Escape)) {
              e.preventDefault()
              inputRef.current?.blur()
            }
          }}
        />
        <SuggestionText>{suggestion || '\u00a0'}</SuggestionText>
      </SearchInputContainer>

      <Flex style={{ gap: '1rem' }}>
        <CommandHotkey
          side="left"
          text="Common search"
          keys={[Keys.Command, Keys.Enter]}
          onResolve={() => onSearch(value)}
          disabled={!value}
        >
          <Button
            size="small"
            type="button"
            style={{ marginBottom: '1.5rem' }}
            onClick={() => onSearch(value)}
            disabled={!value}
          >
            Search
          </Button>
        </CommandHotkey>

        {luckySearchHandler && (
          <CommandHotkey
            side="left"
            text="Lucky search"
            keys={[Keys.Command, Keys.Shift, Keys.Enter]}
            onResolve={luckySearchHandler}
            disabled={!value}
          >
            <Button
              size="small"
              type="button"
              style={{ marginBottom: '1.5rem' }}
              onClick={luckySearchHandler}
              disabled={!value}
            >
              Lucky search
            </Button>
          </CommandHotkey>
        )}
      </Flex>
    </div>
  )
}
