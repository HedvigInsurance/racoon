import { useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import { SearchIcon as InputIcon } from '../../members-search/styles'
import { FileText } from 'react-bootstrap-icons'
import { EmptyContainer } from './TemplateMessagesModal'
import { Template, UpsertTemplateInput } from 'types/generated/graphql'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  height: 100%;
  max-height: 35rem;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
`

const SearchIcon = styled(InputIcon)`
  width: 1rem;
  height: 1rem;
`

const SearchInput = styled(Input)`
  border-radius: unset;
`

const Item = styled.div<{ selected: boolean }>`
  padding: 0.5rem;

  display: flex;
  align-items: center;

  border-bottom: 1px solid ${({ theme }) => theme.border};

  background-color: ${({ selected, theme }) =>
    selected ? theme.accentLight : theme.background};

  cursor: pointer;

  & span {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    padding-top: 1px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.accentLighter};
  }
`

export const SearchTemplate: React.FC<{
  selected: UpsertTemplateInput | null
  templates: Template[]
  onSelect: (template: Template | null) => void
}> = ({ onSelect, selected, templates }) => {
  const [query, setQuery] = useState('')

  const selectHandler = (id: string) => {
    const selectedTemplate = templates.find((template) => template.id === id)

    if (selectedTemplate) {
      onSelect(selectedTemplate)
    }
  }

  const filteredTemplates = templates
    ?.filter((template) =>
      query ? template.title.toLowerCase().includes(query.toLowerCase()) : true,
    )
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1
      }
      if (a.title > b.title) {
        return 1
      }
      return 0
    })

  return (
    <Container>
      <SearchInput
        style={{ borderRadius: 'unset' }}
        onChange={({ target: { value } }) => {
          setQuery(value)
        }}
        icon={<SearchIcon muted={!query} />}
        placeholder="Search Template"
        id="query"
        value={query}
        type="search"
        autoFocus
      />
      <Content>
        {filteredTemplates.length ? (
          filteredTemplates.map((template) => (
            <TemplateItem
              key={template.id}
              id={template.id}
              name={template.title}
              onSelect={selectHandler}
              selected={selected?.id === template.id}
            />
          ))
        ) : (
          <EmptyContainer style={{ marginTop: 15 }}>
            No records found
          </EmptyContainer>
        )}
      </Content>
    </Container>
  )
}

interface TemplateItemProps {
  id: string
  name: string
  onSelect: (id: string) => void
  selected: boolean
}

const TemplateItem = ({ id, name, onSelect, selected }: TemplateItemProps) => {
  return (
    <Item selected={selected} onClick={() => onSelect(id)}>
      <FileText />
      <span>{name}</span>
    </Item>
  )
}
