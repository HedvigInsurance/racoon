import { ReactNode, useState } from 'react'
import * as React from 'react'
import {
  Button,
  Flex,
  Input,
  isPressing,
  Keys,
  Paragraph,
  Shadowed,
  Spinner,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  usePlatform,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import { ItemModelCard, useItemModels } from './index'
import { Grid, List } from 'react-bootstrap-icons'
import { ItemModelListItem } from './ItemModelListItem'

const ModelsCardContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  padding-bottom: 4rem;
`

const ModelsListContainer = styled(Table)`
  padding-bottom: 4rem;
  font-size: ${({ theme }) => theme.fontSize.small};

  & * {
    font-size: ${({ theme }) => theme.fontSize.small};
  }
`

const InputContainer = styled.div`
  position: relative;
  width: 400px;
`

const TipWrapper = styled.div<{ show: boolean }>`
  position: absolute;
  left: calc(100% + 1rem);
  top: 50%;
  width: max-content;
  transform: translateY(-50%);
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 200ms ease;
`

const ViewContainer = styled(Flex)`
  padding-block: 1rem;
`

const Tip = styled(Paragraph)`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
`
const TipButton = styled(Shadowed)`
  background-color: ${({ theme }) => theme.accentLight};
  color: ${({ theme }) => theme.accent};
`

const LIST_VIEWS: Record<string, { value: string; icon: ReactNode }> = {
  LIST: {
    value: 'LIST',
    icon: <List />,
  },
  CARD: {
    value: 'CARD',
    icon: <Grid />,
  },
}

export const ItemModelList = () => {
  const {
    itemModels,
    searchTerm,
    setSearchTerm,
    addModel,
    canAdd,
    typeForAddingModel,
    brandForAddingModel,
    loadingItemModels: loading,
  } = useItemModels()
  const [listViewType, setListViewType] = useState(LIST_VIEWS.LIST)
  const [inputFocused, setInputFocused] = useState(false)
  const { isMetaKey, metaKey } = usePlatform()

  const canSubmit = canAdd({
    name: searchTerm,
    type: typeForAddingModel?.name ?? '',
    brand: brandForAddingModel?.name ?? '',
  })

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isMetaKey(e) && isPressing(e, Keys.Enter)) {
      if (!canSubmit) {
        return
      }
      await addModel({
        name: searchTerm,
        type: typeForAddingModel?.name ?? '',
        brand: brandForAddingModel?.name ?? '',
      })
    }
  }

  return (
    <>
      <InputContainer>
        <Input
          autoFocus
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Search model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TipWrapper show={inputFocused}>
          {canSubmit ? (
            <Tip>
              <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Enter</Shadowed>{' '}
              to add item to{' '}
              <TipButton>{typeForAddingModel?.displayName}</TipButton>{' '}
              <TipButton>{brandForAddingModel?.displayName}</TipButton>
            </Tip>
          ) : (
            searchTerm &&
            !typeForAddingModel && (
              <Tip>
                <Shadowed>Select type above to add</Shadowed>
              </Tip>
            )
          )}
        </TipWrapper>
      </InputContainer>
      <ViewContainer>
        {Object.values(LIST_VIEWS).map(({ value, icon }) => (
          <Button
            key={value}
            icon={icon}
            variant={listViewType.value === value ? 'secondary' : 'tertiary'}
            onClick={() => setListViewType(LIST_VIEWS[value])}
          />
        ))}
      </ViewContainer>
      {loading ? (
        <Spinner />
      ) : !!itemModels.length &&
        listViewType.value === LIST_VIEWS.LIST.value ? (
        <ModelsListContainer>
          <TableHeader>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn>Brand</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {itemModels?.map((itemModel) => (
              <ItemModelListItem key={itemModel.id} itemModel={itemModel} />
            ))}
          </TableBody>
        </ModelsListContainer>
      ) : (
        <ModelsCardContainer>
          {itemModels?.map((itemModel) => (
            <ItemModelCard key={itemModel.id} itemModel={itemModel} />
          ))}
        </ModelsCardContainer>
      )}
    </>
  )
}
