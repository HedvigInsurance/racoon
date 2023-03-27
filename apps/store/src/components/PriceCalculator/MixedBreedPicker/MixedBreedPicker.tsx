import styled from '@emotion/styled'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Text, CrossIconSmall, InfoIcon, theme } from 'ui'
import { Combobox } from '@/components/Combobox/Combobox'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Breed } from '@/services/PriceCalculator/Field.types'

type Props = {
  breeds: Array<Breed>
  defaultSelectedBreeds?: Array<Breed>
  onBreedsChange?: (selectedBreeds: Array<Breed>) => void
  loading?: boolean
  required?: boolean
  name?: string
}

export const MixedBreedPicker = ({
  breeds,
  defaultSelectedBreeds,
  onBreedsChange,
  loading,
  name,
  required,
}: Props) => {
  const [selectedBreeds, setSelectedBreeds] = useState<Array<Breed>>(defaultSelectedBreeds ?? [])
  const { t } = useTranslation('purchase-form')

  const handleDelete = (id: Breed['id']) => () => {
    const newSelectedBreeds = selectedBreeds.filter((breed) => breed.id !== id)
    setSelectedBreeds(newSelectedBreeds)
    onBreedsChange?.(newSelectedBreeds)
  }

  const handleAdd = (breed: Breed | null) => {
    if (breed) {
      const newSelectedBreeds = [...selectedBreeds, breed]
      setSelectedBreeds(newSelectedBreeds)
      onBreedsChange?.(newSelectedBreeds)
    }
  }

  const availableBreeds = useMemo(() => {
    return breeds.filter((breed) => !selectedBreeds.includes(breed))
  }, [breeds, selectedBreeds])

  return (
    <Wrapper>
      <Space y={0.5}>
        <Content>
          <Space y={0.5}>
            <Text size="xs" color="textSecondary">
              {t('FIELD_MIXED_BREEDS_LABEL')}
            </Text>

            {selectedBreeds.length > 0 && (
              <>
                <List>
                  {selectedBreeds.map((breed) => (
                    <ListItem key={breed.id}>
                      <Text size="xl">{breed.displayName}</Text>
                      <DeleteButton
                        type="button"
                        onClick={handleDelete(breed.id)}
                        disabled={loading}
                      >
                        <CrossIconSmall />
                      </DeleteButton>
                    </ListItem>
                  ))}
                </List>
                {selectedBreeds.map((breed) => (
                  <input key={breed.id} type="hidden" name={name} value={breed.id} />
                ))}
              </>
            )}
          </Space>
        </Content>

        <ComboboxWrapper>
          <StyledCombobox
            items={availableBreeds}
            displayValue={(breed) => breed.displayName}
            selectedItem={null}
            onSelectedItemChange={handleAdd}
            placeholder={t('FIELD_MIXED_BREEDS_PLACEHOLDER')}
            noMatchesMessage={t('FIELD_BREEDS_NO_OPTIONS')}
            mutliSelect={true}
            disabled={loading}
            required={required && selectedBreeds.length === 0}
          />
        </ComboboxWrapper>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  paddingBlock: theme.space.sm,
})

const Content = styled.div({
  paddingInline: theme.space.md,
})

const ComboboxWrapper = styled.div({
  paddingInline: theme.space.sm,
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
