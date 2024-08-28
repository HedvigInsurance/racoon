import { Placeholder } from '@hedvig-ui'
import { InsuranceType } from '@hope/features/config/constants'

export const ClaimContractType = ({
  insuranceType,
}: {
  insuranceType: string | undefined
}) => {
  if (!insuranceType) {
    return <Placeholder>Unknown</Placeholder>
  }

  return CONTRACT_TYPE[insuranceType as InsuranceType]
}

const CONTRACT_TYPE = {
  [InsuranceType.SwedishApartment]: 'SE Apartment',
  [InsuranceType.SwedishHouse]: 'SE House',
  [InsuranceType.SwedishObjectlegacy]: 'SE Object',
  [InsuranceType.SwedishAccident]: 'SE Accident',
  [InsuranceType.SwedishCar]: 'SE Car',
  [InsuranceType.SwedishCat]: 'SE Cat',
  [InsuranceType.SwedishDog]: 'SE Dog',
  [InsuranceType.SwedishQasaRental]: 'SE Qasa',
  [InsuranceType.NorwegianAccident]: 'NO Accident',
  [InsuranceType.NorwegianHouse]: 'NO House',
  [InsuranceType.NorwegianTravel]: 'NO Travel',
  [InsuranceType.NorwegianHomeContent]: 'NO Home Content',
  [InsuranceType.DanishAccident]: 'DK Accident',
  [InsuranceType.DanishHouse]: 'DK House',
  [InsuranceType.DanishTravel]: 'DK Travel',
  [InsuranceType.DanishHomeContent]: 'DK Home Content',
} as const
