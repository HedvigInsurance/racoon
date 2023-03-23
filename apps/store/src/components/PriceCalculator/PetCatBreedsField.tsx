import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Combobox } from '@/components/Combobox/Combobox'
import { PriceIntentAnimal, usePriceIntentAvailableBreedsQuery } from '@/services/apollo/generated'
import {
  PetCatBreedsField as InputFieldPetBreed,
  Breed,
} from '@/services/PriceCalculator/Field.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  field: InputFieldPetBreed
  loading: boolean
}

export const PetCatBreedsField = ({ field, loading }: Props) => {
  const translateLabel = useTranslateFieldLabel()
  const { t } = useTranslation('purchase-form')
  const { breeds } = usePetBreeds(PriceIntentAnimal.Cat)

  let defaultSelectedBreed: Breed | null = null
  if (field.value) {
    defaultSelectedBreed = breeds.find((breed) => breed.id === field.value?.[0]) ?? null
  }

  // Used to re-mount Combobox when 'breeds' becomes available,
  // otherwise it might happen the case where 'defaultSelectedItem'
  // doesn't get taken into account due the absence of 'breeds'
  const key = useMemo(() => JSON.stringify(breeds), [breeds])

  return (
    <Combobox
      key={key}
      items={breeds}
      defaultSelectedItem={defaultSelectedBreed}
      placeholder={translateLabel(field.label)}
      displayValue={breedToString}
      getFormValue={breedToFormValue}
      name={field.name}
      required={field.required}
      disabled={loading}
      noMatchesMessage={t('FIELD_BREEDS_NO_OPTIONS')}
    />
  )
}

const breedToString = (breed: Breed) => breed.displayName

const breedToFormValue = (breed: Breed) => breed.id

const usePetBreeds = (animal: PriceIntentAnimal) => {
  const { data, error, loading } = usePriceIntentAvailableBreedsQuery({
    variables: {
      animal,
    },
  })

  if (error) {
    throw new Error('Could not get available breeds for cat')
  }

  const breeds = useMemo(
    () => data?.priceIntentAvailableBreeds ?? [],
    [data?.priceIntentAvailableBreeds],
  )

  return { breeds, error, loading }
}
