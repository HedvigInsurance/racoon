import { useMemo } from 'react'
import { Combobox } from '@/components/Combobox/Combobox'
import { usePriceIntentAvailableBreedsQuery } from '@/services/apollo/generated'
import { PetBreedField as InputFieldPetBreed, Breed } from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type PetBreedFieldProps = {
  field: InputFieldPetBreed
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
}

export const PetBreedField = ({ field, onSubmit, loading }: PetBreedFieldProps) => {
  const translateLabel = useTranslateFieldLabel()

  const { data, error } = usePriceIntentAvailableBreedsQuery({
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
  let defaultSelectedItem: Breed | null = null
  if (field.value) {
    defaultSelectedItem = availableBreeds.find((breed) => breed.id === field.value?.[0]) ?? null
  }

  const handleSelectBreed = async (selectedBreed: Breed | null) => {
    await onSubmit({
      [field.name]: selectedBreed ? [selectedBreed.id] : [],
    })
  }

  if (error) {
    // TODO better handle error
    return <span>Unable to fetch breeds.</span>
  }

  return (
    <Combobox
      items={availableBreeds}
      defaultSelectedItem={defaultSelectedItem}
      onSelectedItemChange={handleSelectBreed}
      placeholder={translateLabel(field.label)}
      displayValue={breedToString}
      required={field.required}
      disabled={loading}
    />
  )
}

const breedToString = (breed: Breed) => breed.displayName
