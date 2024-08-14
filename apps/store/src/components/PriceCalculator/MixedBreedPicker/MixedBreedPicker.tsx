import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import { Text, CrossIconSmall, xStack, yStack } from 'ui'
import { Combobox } from '@/components/Combobox/Combobox'
import type { Breed } from '@/services/PriceCalculator/Field.types'
import { wrapper, content, deleteButton, combobox } from './MixedBreedPicker.css'

type Props = {
  breeds: Array<Breed>
  defaultSelectedBreeds?: Array<Breed>
  onBreedsChange?: (selectedBreeds: Array<Breed>) => void
  loading?: boolean
  name?: string
}

export const MixedBreedPicker = ({
  breeds,
  defaultSelectedBreeds,
  onBreedsChange,
  loading,
  name,
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
    <div className={wrapper}>
      <div className={content}>
        <Text size="xs" color="textSecondary">
          {t('FIELD_MIXED_BREEDS_LABEL')}
        </Text>

        {selectedBreeds.length > 0 && (
          <>
            <ul className={yStack({ gap: 'xs' })}>
              {selectedBreeds.map((breed) => (
                <li key={breed.id} className={xStack({ justifyContent: 'space-between' })}>
                  <Text size="xl">{breed.displayName}</Text>
                  <button
                    className={deleteButton}
                    type="button"
                    onClick={handleDelete(breed.id)}
                    disabled={loading}
                  >
                    <CrossIconSmall />
                  </button>
                </li>
              ))}
            </ul>
            {selectedBreeds.map((breed) => (
              <input key={breed.id} type="hidden" name={name} value={breed.id} />
            ))}
          </>
        )}
      </div>

      <Combobox
        className={combobox}
        items={availableBreeds}
        displayValue={(breed) => breed.displayName}
        selectedItem={null}
        onSelectedItemChange={handleAdd}
        placeholder={t('FIELD_MIXED_BREEDS_PLACEHOLDER')}
        noMatchesMessage={t('FIELD_BREEDS_NO_OPTIONS')}
        mutliSelect={true}
        disabled={loading}
        required={selectedBreeds.length === 0}
        size="small"
      />
    </div>
  )
}
