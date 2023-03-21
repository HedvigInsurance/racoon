import { useTranslation } from 'react-i18next'
import { Combobox } from '@/components/Combobox/Combobox'
import { PriceIntentAnimal, usePriceIntentAvailableBreedsQuery } from '@/services/apollo/generated'
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
  const { t } = useTranslation('purchase-form')
  const { breeds, error } = usePetBreeds(field.animal)

  // The following will removed when we add support for mixed breeds
  let defaultSelectedBreed: Breed | null = null
  if (field.value) {
    defaultSelectedBreed = breeds.find((breed) => breed.id === field.value?.[0]) ?? null
  }

  const handleSelectBreed = (selectedBreed: Breed | null) => {
    onSubmit({
      [field.name]: selectedBreed ? [selectedBreed.id] : [],
    })
  }

  if (error) {
    throw new Error(`Could not get available breeds for animal ${field.animal}`)
  }

  return (
    <Combobox
      items={breeds}
      defaultSelectedItem={defaultSelectedBreed}
      onSelectedItemChange={handleSelectBreed}
      placeholder={translateLabel(field.label)}
      displayValue={breedToString}
      required={field.required}
      disabled={loading}
      noMatchesMessage={t('FIELD_BREEDS_NO_OPTIONS')}
    />
  )
}

const usePetBreeds = (animal: PriceIntentAnimal) => {
  const { data, error, loading } = usePriceIntentAvailableBreedsQuery({
    variables: {
      animal,
    },
  })
  const breeds = data?.priceIntentAvailableBreeds ?? []

  return { breeds, error, loading }
}

const breedToString = (breed: Breed) => breed.displayName
