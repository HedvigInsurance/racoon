import { CountryCode } from '@/services/apollo/generated'

const VALID_VALUES = Object.values(CountryCode)

export const isCountryCode = (value: unknown): value is CountryCode => {
  return typeof value === 'string' && VALID_VALUES.includes(value as CountryCode)
}
