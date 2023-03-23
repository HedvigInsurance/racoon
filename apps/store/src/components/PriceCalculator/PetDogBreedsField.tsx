import { datadogLogs } from '@datadog/browser-logs'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Space } from 'ui'
import { Combobox } from '@/components/Combobox/Combobox'
import { PriceIntentAnimal, usePriceIntentAvailableBreedsQuery } from '@/services/apollo/generated'
import {
  PetDogBreedsField as InputFieldPetDogBreeds,
  Breed,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { MixedBreedPicker } from './MixedBreedPicker/MixedBreedPicker'

const MIXED_BREED_ID = '-1'

type Props = {
  field: InputFieldPetDogBreeds
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
}

export const PetDogBreedsField = ({ field, onSubmit, loading }: Props) => {
  const [showMixedPicker, setShowMixedPicker] = useState(() => (field.value ?? []).length > 1)
  const { t } = useTranslation('purchase-form')

  const {
    breeds,
    comboboxAvailableBreeds,
    mixedBreedPickerAvailableBreeds,
    selectedBreeds,
    defaultSelectedBreed,
  } = usePetDogBreedFieldState(field.value)

  const handleBreedsChange = (selectedBreeds: Array<Breed>) => {
    onSubmit({
      [field.name]: selectedBreeds.map((breed) => breed.id),
    })
  }

  const handleComboboxChange = (breed: Breed | null) => {
    if (breed) {
      if (breed.id === MIXED_BREED_ID) {
        setShowMixedPicker(true)
      } else {
        handleBreedsChange([breed])
      }
    } else {
      setShowMixedPicker(false)
      handleBreedsChange([])
    }
  }

  const handleMixedBreedPickerChange = (selectedBreeds: Breed[]) => {
    if (selectedBreeds.length === 0) {
      handleBreedsChange([])
    } else {
      handleBreedsChange(selectedBreeds)
    }
  }
  return (
    <Space y={0.25}>
      <Combobox
        // Remounts the component when 'breeds' list becames avaible (trhough API)
        // so the correct 'defaultSelectedItem' gets taken into account
        key={JSON.stringify(breeds)}
        items={comboboxAvailableBreeds}
        displayValue={(item) => item.displayName}
        placeholder={t('FIELD_BREEDS_PLACEHOLDER')}
        defaultSelectedItem={defaultSelectedBreed}
        onSelectedItemChange={handleComboboxChange}
        required={field.required}
      />

      {showMixedPicker && (
        <MixedBreedPicker
          breeds={mixedBreedPickerAvailableBreeds}
          selectedBreeds={selectedBreeds}
          onBreedsChange={handleMixedBreedPickerChange}
          loading={loading}
          required={field.required}
        />
      )}
    </Space>
  )
}

const usePetDogBreedFieldState = (preSelectedBreedIds: Array<string> = []) => {
  const { t } = useTranslation('purchase-form')
  const { data, error } = usePriceIntentAvailableBreedsQuery({
    variables: {
      animal: PriceIntentAnimal.Dog,
    },
  })

  if (error) {
    throw new Error('PetDogBreedsField: Could not get available breeds for dog')
  }

  const MIXED_BREED_OPTION = useMemo<Breed>(
    () => ({
      id: MIXED_BREED_ID,
      displayName: t('LABEL_MIXED_BREED'),
    }),
    [t],
  )

  const breeds = useMemo(
    () => data?.priceIntentAvailableBreeds ?? [],
    [data?.priceIntentAvailableBreeds],
  )

  const derivedState = useMemo(() => {
    let selectedBreeds: Array<Breed> = []
    let comboboxAvailableBreeds: Array<Breed> = []
    let mixedBreedPickerAvailableBreeds: Array<Breed> = []
    if (breeds.length > 0) {
      selectedBreeds = preSelectedBreedIds.map((breedId) => {
        const matchedBreed = breeds.find((breed) => breed.id === breedId)
        if (!matchedBreed) {
          datadogLogs.logger.warn(`PetDogBreedsField: couldn't found breed of id ${breedId}`)
          return { id: breedId, displayName: breedId }
        }
        return { id: matchedBreed.id, displayName: matchedBreed.displayName }
      })

      comboboxAvailableBreeds = [MIXED_BREED_OPTION, ...breeds]

      mixedBreedPickerAvailableBreeds = breeds.filter(
        (breed) => !selectedBreeds.some((selectedBreed) => selectedBreed.id === breed.id),
      )
    }

    let defaultSelectedBreed: Breed | null = null
    if (selectedBreeds.length > 1) {
      defaultSelectedBreed = MIXED_BREED_OPTION
    } else if (selectedBreeds.length === 1) {
      defaultSelectedBreed = selectedBreeds[0]
    }

    return {
      breeds,
      comboboxAvailableBreeds,
      mixedBreedPickerAvailableBreeds,
      selectedBreeds,
      defaultSelectedBreed,
    }
  }, [breeds, preSelectedBreedIds, MIXED_BREED_OPTION])

  return derivedState
}
