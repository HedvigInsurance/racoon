import { datadogLogs } from '@datadog/browser-logs'
import { useState } from 'react'
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

const MIXED_BREED_OPTION: Breed = {
  id: '-1',
  // TODO: localise this
  displayName: 'Mixed breed',
}

type Props = {
  field: InputFieldPetDogBreeds
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
}

export const PetDogBreedsField = ({ field, onSubmit, loading }: Props) => {
  const [selectedBreeds, setSelectedBreeds] = useState<Array<Breed>>([])
  const { t } = useTranslation('purchase-form')

  const { data, error } = usePriceIntentAvailableBreedsQuery({
    variables: {
      animal: PriceIntentAnimal.Dog,
    },
    onCompleted(data) {
      if (field.value && field.value.length > 0) {
        const avaialbleBreeds = data.priceIntentAvailableBreeds
        const preSelectedBreeds = field.value.map((breedId) => {
          const matchedBreed = avaialbleBreeds.find((breed) => breed.id === breedId)

          if (!matchedBreed) {
            datadogLogs.logger.warn(`PetDogBreedsField: couldn't found breed of id ${breedId}`)
            return { id: breedId, displayName: breedId }
          }

          return matchedBreed
        })

        setSelectedBreeds(
          preSelectedBreeds.length > 1
            ? [MIXED_BREED_OPTION, ...preSelectedBreeds]
            : preSelectedBreeds,
        )
      }
    },
  })

  const handleBreedsChange = (selectedBreeds: Array<Breed>) => {
    onSubmit({
      [field.name]: selectedBreeds.map((breed) => breed.id),
    })
  }

  if (error) {
    throw new Error('PetDogBreedsField: Could not get available breeds for dog')
  }

  const availableBreeds = data?.priceIntentAvailableBreeds ?? []
  const availableBreedsPlusMixedBreed = [MIXED_BREED_OPTION, ...availableBreeds]
  const realSelectedBreeds = selectedBreeds.filter((breed) => breed.id !== MIXED_BREED_OPTION.id)
  const singleOptionSelectedItem =
    selectedBreeds.length > 1 ? MIXED_BREED_OPTION : selectedBreeds[0] ?? null
  const displayMixedBreedPicker = selectedBreeds.some((breed) => breed.id === MIXED_BREED_OPTION.id)

  return (
    <Space y={0.25}>
      <Combobox
        items={availableBreedsPlusMixedBreed}
        displayValue={(item) => item.displayName}
        placeholder={t('FIELD_BREEDS_PLACEHOLDER')}
        selectedItem={singleOptionSelectedItem}
        onSelectedItemChange={(item) => {
          if (item) {
            setSelectedBreeds([item])

            if (item.id !== MIXED_BREED_OPTION.id) {
              handleBreedsChange([item])
            }
          } else {
            setSelectedBreeds([])
            handleBreedsChange([])
          }
        }}
        required={field.required}
      />

      {displayMixedBreedPicker && (
        <MixedBreedPicker
          breeds={availableBreeds}
          selectedBreeds={realSelectedBreeds}
          onBreedsChange={(selectedBreeds) => {
            if (selectedBreeds.length > 0) {
              setSelectedBreeds([MIXED_BREED_OPTION, ...selectedBreeds])
              handleBreedsChange(selectedBreeds)
            } else {
              setSelectedBreeds([])
              handleBreedsChange([])
            }
          }}
          loading={loading}
        />
      )}
    </Space>
  )
}
