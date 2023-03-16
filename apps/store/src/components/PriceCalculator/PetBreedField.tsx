import { useState, useMemo } from 'react'
import { Combobox } from '@/components/Combobox/Combobox'
import {
  usePriceIntentAvailableBreedsQuery,
  PriceIntentAnimalBreed,
} from '@/services/apollo/generated'
import { PetBreedField as InputFieldPetBreed } from '@/services/PriceCalculator/Field.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Breed = Pick<PriceIntentAnimalBreed, 'id' | 'displayName'>

type PetBreedFieldProps = {
  field: InputFieldPetBreed
  loading?: boolean
}

export const PetBreedField = ({ field }: PetBreedFieldProps) => {
  const translateLabel = useTranslateFieldLabel()

  const { data, loading: isLoadingAvailableBreeds } = usePriceIntentAvailableBreedsQuery({
    variables: {
      animal: field.animal,
    },
  })

  const availableBreeds: Array<Breed> = useMemo(
    () =>
      (data?.priceIntentAvailableBreeds ?? []).map(({ id, displayName }) => ({
        id,
        displayName,
      })),
    [data?.priceIntentAvailableBreeds],
  )

  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(
    () => availableBreeds.find((breed) => breed.id === field.value) ?? null,
  )

  return (
    <>
      <Combobox
        items={availableBreeds}
        selectedItem={selectedBreed}
        onSelectedItemChange={setSelectedBreed}
        placeholder={translateLabel(field.label)}
        displayValue={breedToString}
        required={field.required}
        loading={isLoadingAvailableBreeds}
      />
      <input type="hidden" name={field.name} value={selectedBreed?.id} />
    </>
  )
}

const breedToString = (breed: Breed) => breed.displayName
