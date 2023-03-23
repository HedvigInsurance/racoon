import { useTranslation } from 'react-i18next'
import { Combobox } from '@/components/Combobox/Combobox'
import { PriceIntentAnimal, usePriceIntentAvailableBreedsQuery } from '@/services/apollo/generated'
import {
  PetCatBreedsField as InputFieldPetBreed,
  Breed,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  field: InputFieldPetBreed
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
}

export const PetCatBreedsField = ({ field, onSubmit, loading }: Props) => {
  const translateLabel = useTranslateFieldLabel()
  const { t } = useTranslation('purchase-form')
  const { breeds } = usePetBreeds(PriceIntentAnimal.Cat)

  let defaultSelectedBreed: Breed | null = null
  if (field.value) {
    defaultSelectedBreed = breeds.find((breed) => breed.id === field.value?.[0]) ?? null
  }

  const handleSelectBreed = (selectedBreed: Breed | null) => {
    onSubmit({
      [field.name]: selectedBreed ? [selectedBreed.id] : [],
    })
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

const breedToString = (breed: Breed) => breed.displayName

const usePetBreeds = (animal: PriceIntentAnimal) => {
  const { data, error, loading } = usePriceIntentAvailableBreedsQuery({
    variables: {
      animal,
    },
  })

  if (error) {
    throw new Error('Could not get available breeds for cat')
  }

  const breeds = data?.priceIntentAvailableBreeds ?? []

  return { breeds, error, loading }
}
