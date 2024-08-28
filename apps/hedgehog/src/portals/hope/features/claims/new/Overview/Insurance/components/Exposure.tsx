import { InsuranceItem } from './InsuranceItem'

export const Exposure = ({
  petName,
  registrationNumber,
  street,
}: {
  petName: string | null | undefined
  registrationNumber: string | null | undefined
  street: string | undefined
}) => {
  if (petName) {
    return <InsuranceItem label="Pet name" value={petName} />
  }

  if (registrationNumber) {
    return <InsuranceItem label="Vehicle" value={registrationNumber} />
  }

  if (street) {
    return <InsuranceItem label="Address" value={street} />
  }

  return null
}
