import Personnummer from 'personnummer'
import { type ShopSessionCustomerUpdateInput } from '@/services/graphql/graphql'

// Search Params from Partner Widget
export enum SearchParam {
  // Customer Data
  Email = 'email',
  Ssn = 'ssn',

  // Product Name Data
  ProductName = 'productName',
  // @deprecated: replaced by "productName"
  ProductType = 'productType',
  // @deprecated: replaced by "productName"
  ApartmentSubType = 'subType',

  // Price Intent Data
  StreetAddress = 'street',
  ZipCode = 'zipCode',
  LivingSpace = 'livingSpace',
  NumberCoInsured = 'numberCoInsured',
  // @deprecated: replaced by "numberCoInsured"
  CoInsured = 'coInsured',
  IsStudent = 'isStudent',
  // @deprecated: replaced by "isStudent"
  Student = 'student',

  // No longer used?
  PhoneNumber = 'phoneNumber',

  // Shop Session Create Partner Data
  ExternalMemberId = 'externalMemberId',
  ExternalRequestId = 'requestId',
}

type CustomerData = Omit<ShopSessionCustomerUpdateInput, 'shopSessionId'>

export const parseCustomerDataSearchParams = (
  searchParams: URLSearchParams,
): [CustomerData, URLSearchParams] => {
  const updatedSearchParams = new URLSearchParams(searchParams.toString())

  const searchSsn = updatedSearchParams.get(SearchParam.Ssn)
  let ssn: string | undefined = undefined
  if (searchSsn && Personnummer.valid(searchSsn)) {
    ssn = Personnummer.parse(searchSsn).format(true)
    updatedSearchParams.delete(SearchParam.Ssn)
  }

  const email = searchParams.get(SearchParam.Email)
  if (email) updatedSearchParams.delete(SearchParam.Email)

  return [
    {
      ...(ssn && { ssn }),
      ...(email && { email }),
    },
    updatedSearchParams,
  ]
}

export const parseProductNameSearchParams = (
  searchParams: URLSearchParams,
): [string | null, URLSearchParams] => {
  const updatedSearchParams = new URLSearchParams(searchParams.toString())

  const productName = updatedSearchParams.get(SearchParam.ProductName)
  updatedSearchParams.delete(SearchParam.ProductName)
  if (productName) {
    return [productName, updatedSearchParams]
  }

  const productType = updatedSearchParams.get(SearchParam.ProductType)
  if (productType) updatedSearchParams.delete(SearchParam.ProductType)

  const subType = updatedSearchParams.get(SearchParam.ApartmentSubType)
  if (subType) updatedSearchParams.delete(SearchParam.ApartmentSubType)

  return [getProductName(productType, subType), updatedSearchParams]
}

// Legacy, used by Partner Widget
// TODO: migrate to use our new product names directly in the URL
const getProductName = (productType: string | null, subType: string | null): string | null => {
  switch (productType) {
    case 'SWEDISH_APARTMENT':
      return subType === 'BRF' ? 'SE_APARTMENT_BRF' : 'SE_APARTMENT_RENT'
    case 'SWEDISH_HOUSE':
      return 'SE_HOUSE'
    case 'SWEDISH_ACCIDENT':
      return 'SE_ACCIDENT'
    default:
      return null
  }
}

export const parsePriceIntentDataSearchParams = (
  searchParams: URLSearchParams,
): [Record<string, unknown>, URLSearchParams] => {
  const updatedSearchParams = new URLSearchParams(searchParams.toString())

  const street = searchParams.get(SearchParam.StreetAddress)
  updatedSearchParams.delete(SearchParam.StreetAddress)

  const zipCode = searchParams.get(SearchParam.ZipCode)
  updatedSearchParams.delete(SearchParam.ZipCode)

  const searchLivingSpace = searchParams.get(SearchParam.LivingSpace)
  const livingSpace = searchLivingSpace ? parseNumber(searchLivingSpace) : undefined
  if (livingSpace !== undefined) updatedSearchParams.delete(SearchParam.LivingSpace)

  const searchNumberCoInsured = searchParams.get(SearchParam.NumberCoInsured)
  let numberCoInsured = searchNumberCoInsured ? parseNumber(searchNumberCoInsured) : undefined
  if (numberCoInsured !== undefined) updatedSearchParams.delete(SearchParam.NumberCoInsured)

  if (numberCoInsured === undefined) {
    // Legacy, used by Partner Widget
    const searchCoInsured = searchParams.get(SearchParam.CoInsured)
    numberCoInsured = searchCoInsured ? parseNumber(searchCoInsured) : undefined
    if (numberCoInsured !== undefined) updatedSearchParams.delete(SearchParam.CoInsured)
  }

  let isStudent = parseBoolean(searchParams.get(SearchParam.IsStudent))
  if (isStudent !== undefined) updatedSearchParams.delete(SearchParam.IsStudent)

  if (isStudent === undefined) {
    // Legacy, used by Partner Widget
    isStudent = parseBoolean(searchParams.get(SearchParam.Student)?.toLowerCase())
    if (isStudent !== undefined) updatedSearchParams.delete(SearchParam.Student)
  }

  const data = {
    ...(street && { street }),
    ...(zipCode && { zipCode }),
    ...(livingSpace && { livingSpace }),
    ...(numberCoInsured && { numberCoInsured }),
    ...(isStudent !== undefined && { isStudent }),
  }

  return [data, updatedSearchParams]
}

const parseNumber = (value: string): number | undefined => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? undefined : parsed
}

const parseBoolean = (value: unknown): boolean | undefined => {
  switch (value) {
    case 'yes':
      return true
    case 'no':
      return false
    case '1':
      return true
    case '0':
      return false
    default:
      return undefined
  }
}
