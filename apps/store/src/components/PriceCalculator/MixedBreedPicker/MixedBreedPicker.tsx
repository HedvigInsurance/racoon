import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Text, CrossIconSmall, InfoIcon, theme } from 'ui'
import { Combobox } from '@/components/Combobox/Combobox'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Breed } from '@/services/PriceCalculator/Field.types'

type Props = {
  breeds: Array<Breed>
  onSelectedBreedsChange?: (selectedBreeds: Array<Breed>) => void
}

export const MixedBreedPicker = ({ breeds, onSelectedBreedsChange }: Props) => {
  const [selectedBreeds, setSelectedBreeds] = useState<Array<Breed>>([])
  const { t } = useTranslation('purchase-form')

  const handleDelete = (id: Breed['id']) => () => {
    const newSelectedBreeds = selectedBreeds.filter((breed) => breed.id !== id)
    setSelectedBreeds(newSelectedBreeds)
    onSelectedBreedsChange?.(newSelectedBreeds)
  }

  const handleAdd = (breed: Breed | null) => {
    if (breed) {
      const newSelectedBreeds = [...selectedBreeds, breed]
      setSelectedBreeds(newSelectedBreeds)
      onSelectedBreedsChange?.(newSelectedBreeds)
    }
  }

  const availableBreeds = useMemo(() => {
    return breeds.filter((breed) => !selectedBreeds.includes(breed))
  }, [breeds, selectedBreeds])

  return (
    <Wrapper>
      <Space y={0.5}>
        <Text size="xs" color="textSecondary">
          {t('FIELD_SUB_BREEDS_LABEL')}
        </Text>

        {selectedBreeds.length > 0 && (
          <List>
            {selectedBreeds.map((breed) => (
              <ListItem key={breed.id}>
                <Text size="xl">{breed.displayName}</Text>
                <DeleteButton type="button" onClick={handleDelete(breed.id)}>
                  <CrossIconSmall />
                </DeleteButton>
              </ListItem>
            ))}
          </List>
        )}

        <StyledCombobox
          items={availableBreeds}
          displayValue={(breed) => breed.displayName}
          selectedItem={null}
          onSelectedItemChange={handleAdd}
          placeholder="Search breed"
          mutliSelect={true}
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

const DeleteButton = styled.button({
  cursor: 'pointer',
})

// Workaround: generics are not preserved for styled components: shorturl.at/hqyL2
const StyledCombobox = styled(Combobox)({
  backgroundColor: theme.colors.opaque2,
}) as typeof Combobox<Breed>

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
