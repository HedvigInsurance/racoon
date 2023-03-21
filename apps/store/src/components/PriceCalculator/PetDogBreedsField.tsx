import { datadogLogs } from '@datadog/browser-logs'
import { useMemo } from 'react'
import { PriceIntentAnimal, usePriceIntentAvailableBreedsQuery } from '@/services/apollo/generated'
import {
  PetDogBreedsField as InputFieldPetDogBreeds,
  Breed,
} from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { MixedBreedPicker } from './MixedBreedPicker/MixedBreedPicker'

type Props = {
  field: InputFieldPetDogBreeds
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
}

export const PetDogBreedsField = ({ field, onSubmit, loading }: Props) => {
  const { breeds, error } = usePetBreeds(PriceIntentAnimal.Dog)

  const handleBreedsChange = (selectedBreeds: Array<Breed>) => {
    onSubmit({
      [field.name]: selectedBreeds.map((breed) => breed.id),
    })
  }

  if (error) {
    throw new Error('PetDogBreedsField: Could not get available breeds for dog')
  }

  const selectedBreeds = useMemo<Array<Breed>>(() => {
    return (field.value ?? []).map((breedId) => {
      const matchedBreed = breeds.find((breed) => breed.id === breedId)
      if (!matchedBreed) {
        datadogLogs.logger.warn(`PetDogBreedsField: couldn't found breed of id ${breedId}`)
        return { id: breedId, displayName: breedId }
      }

      return matchedBreed
    })
  }, [breeds, field.value])

  return (
    <MixedBreedPicker
      breeds={breeds}
      selectedBreeds={selectedBreeds}
      onBreedsChange={handleBreedsChange}
      loading={loading}
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
