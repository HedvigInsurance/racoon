import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEvent } from 'react'
import { CrossIconSmall, InfoIcon, Space, Text, theme } from 'ui'
import { Combobox } from '@/components/Combobox/Combobox'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Item = { id: string; displayName: string }

type Props = {
  items: Array<Item>
  onSubmitAdd: (item: Item) => void
  loadingAdd: boolean
  onSubmitDelete: (item: Item) => void
  loadingDelete: boolean
}

export const MixedBreedPicker = (props: Props) => {
  const { items, loadingDelete, onSubmitDelete, onSubmitAdd } = props
  const { t } = useTranslation('purchase-form')

  const handleSubmitDelete = (item: Item) => (event: FormEvent) => {
    event.preventDefault()
    onSubmitDelete(item)
  }

  const handleSelect = (item: Item | null) => {
    if (item) onSubmitAdd(item)
  }

  return (
    <Wrapper>
      <Space y={0.5}>
        <Text size="xs" color="textSecondary">
          {t('FIELD_SUB_BREEDS_LABEL')}
        </Text>

        <List>
          {items.map((item) => (
            <ListItem key={item.id}>
              <Text size="xl">{item.displayName}</Text>
              <form onSubmit={handleSubmitDelete(item)}>
                <DeleteButton type="submit" disabled={loadingDelete}>
                  <CrossIconSmall />
                </DeleteButton>
              </form>
            </ListItem>
          ))}
        </List>

        <StyledCombobox
          placeholder="Search breed..."
          items={BREED_LIST}
          onSelectedItemChange={handleSelect}
          displayValue={(breed) => breed.displayName}
          disabled={loadingDelete}
        />
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,
})

const List = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xs,
})
const ListItem = styled.li({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const DeleteButton = styled.button({ cursor: 'pointer' })

type MessageProps = { children: string }

export const Message = ({ children }: MessageProps) => {
  return (
    <MessageWrapper>
      <SpaceFlex space={0.25}>
        <MessageIcon size={theme.fontSizes.xs} color={theme.colors.textSecondary} />
        <Text size="xs">{children}</Text>
      </SpaceFlex>
    </MessageWrapper>
  )
}

const MessageWrapper = styled.div({
  paddingInline: theme.space.md,
})

const MessageIcon = styled(InfoIcon)({
  flexShrink: 0,
  position: 'relative',
  top: 2,
})

// Workaround: generics are not preserved for styled components: shorturl.at/hqyL2
const StyledCombobox = styled(Combobox)({
  backgroundColor: theme.colors.opaque2,
}) as typeof Combobox<Item>

// TODO: get from API
const BREED_LIST: Array<Item> = [
  {
    id: '1',
    displayName: 'Foxhound',
  },
  {
    id: '2',
    displayName: 'Poodle',
  },
  {
    id: '3',
    displayName: 'Labrador',
  },
  {
    id: '4',
    displayName: 'Pug',
  },
  {
    id: '5',
    displayName: 'Bulldog',
  },
]
