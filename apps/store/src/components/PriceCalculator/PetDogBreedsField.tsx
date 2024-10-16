import { datadogLogs } from '@datadog/browser-logs'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useState, useMemo } from 'react'
import { Space } from 'ui'
import { Combobox } from '@/components/Combobox/Combobox'
import { priceCalculatorLoadingAtom } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { PriceIntentAnimal, usePriceIntentAvailableBreedsQuery } from '@/services/graphql/generated'
import type {
  PetDogBreedsField as InputFieldPetDogBreeds,
  Breed,
} from '@/services/PriceCalculator/Field.types'
import { MIXED_BREED_OPTION_ID } from '@/services/PriceCalculator/Field.types'
import { MixedBreedPicker } from './MixedBreedPicker/MixedBreedPicker'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  field: InputFieldPetDogBreeds
}

export const PetDogBreedsField = ({ field }: Props) => {
  const loading = useAtomValue(priceCalculatorLoadingAtom)
  const translateLabel = useTranslateFieldLabel()
  const [showMixedPicker, setShowMixedPicker] = useState(() => (field.value ?? []).length > 1)
  const { t } = useTranslation('purchase-form')

  const {
    breeds,
    pureBreeds,
    defaultSelectedBreeds,
    comboboxAvailableBreeds,
    comboboxDefaultSelectedBreed,
  } = usePetDogBreedFieldState(field.value)

  const handleComboboxChange = (breed: Breed | null) => {
    setShowMixedPicker(breed?.id === MIXED_BREED_OPTION_ID)
  }

  return (
    <Space y={0.25}>
      <Combobox
        // Re-mount Combobox when 'breeds' becomes available,
        // otherwise it might happen the case where 'defaultSelectedItem'
        // doesn't get taken into account due the absence of 'breeds'
        key={breeds.length}
        items={comboboxAvailableBreeds}
        defaultSelectedItem={comboboxDefaultSelectedBreed}
        displayValue={(item) => item.displayName}
        getFormValue={breedToFormValue}
        label={translateLabel(field.label)}
        placeholder={t('FIELD_BREEDS_PLACEHOLDER')}
        onSelectedItemChange={handleComboboxChange}
        name={field.name}
        required={field.required}
        disabled={loading}
        noMatchesMessage={t('FIELD_BREEDS_NO_OPTIONS')}
      />

      {showMixedPicker && (
        <MixedBreedPicker
          breeds={pureBreeds}
          defaultSelectedBreeds={defaultSelectedBreeds}
          name={field.name}
          loading={loading}
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
      id: MIXED_BREED_OPTION_ID,
      displayName: t('LABEL_MIXED_BREED'),
    }),
    [t],
  )

  const breeds = useMemo(
    () => data?.priceIntentAvailableBreeds ?? [],
    [data?.priceIntentAvailableBreeds],
  )

  const pureBreeds = useMemo(
    () => data?.priceIntentAvailableBreeds.filter((item) => !item.isMixedBreed) ?? [],
    [data?.priceIntentAvailableBreeds],
  )

  return useMemo(() => {
    let comboboxAvailableBreeds: Array<Breed> = []
    let comboboxDefaultSelectedBreed: Breed | null = null
    let defaultSelectedBreeds: Array<Breed> = []
    if (breeds.length > 0) {
      defaultSelectedBreeds = preSelectedBreedIds.map((breedId) => {
        const matchedBreed = breeds.find((breed) => breed.id === breedId)
        if (!matchedBreed) {
          datadogLogs.logger.warn(`PetDogBreedsField: couldn't found breed of id ${breedId}`)
          return { id: breedId, displayName: breedId }
        }
        return { id: matchedBreed.id, displayName: matchedBreed.displayName }
      })

      comboboxAvailableBreeds = [MIXED_BREED_OPTION, ...breeds]

      if (defaultSelectedBreeds.length > 1) {
        comboboxDefaultSelectedBreed = MIXED_BREED_OPTION
      } else if (defaultSelectedBreeds.length === 1) {
        comboboxDefaultSelectedBreed = defaultSelectedBreeds[0]
      }
    }

    return {
      breeds,
      pureBreeds,
      comboboxAvailableBreeds,
      comboboxDefaultSelectedBreed,
      defaultSelectedBreeds,
    }
  }, [breeds, pureBreeds, preSelectedBreedIds, MIXED_BREED_OPTION])
}

const breedToFormValue = (breed: Breed) => breed.id
