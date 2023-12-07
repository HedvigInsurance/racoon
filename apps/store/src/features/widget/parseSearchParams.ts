import Personnummer from 'personnummer'
import {
  type ShopSessionCreatePartnerMutationVariables,
  type ShopSessionCustomerUpdateInput,
} from '@/services/apollo/generated'
import { EXTERNAL_REQUEST_ID_QUERY_PARAM } from './widget.constants'

// Search Params from Partner Widget
enum SearchParam {
  // Customer Data
  Email = 'email',
  Ssn = 'ssn',

  // Product Name Data
  ProductType = 'productType',
  ApartmentSubType = 'subType',

  // Price Intent Data
  StreetAddress = 'street',
  ZipCode = 'zipCode',
  LivingSpace = 'livingSpace',
  NumberCoInsured = 'coInsured',
  Student = 'student',

  // No longer used?
  PhoneNumber = 'phoneNumber',

  // Shop Session Create Partner Data
  ExternalMemberId = 'externalMemberId',
  ExternalRequestId = EXTERNAL_REQUEST_ID_QUERY_PARAM,
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

  const productType = updatedSearchParams.get(SearchParam.ProductType)
  if (productType) updatedSearchParams.delete(SearchParam.ProductType)

  const subType = updatedSearchParams.get(SearchParam.ApartmentSubType)
  if (subType) updatedSearchParams.delete(SearchParam.ApartmentSubType)

  const productName = getProductName(productType, subType)

  return [productName || productType, updatedSearchParams]
}

// Legacy, used by Partner Widget
// TODO: migrate to use our new product names directly in the URL
const getProductName = (productType: string | null, subType: string | null): string | undefined => {
  switch (productType) {
    case 'SWEDISH_APARTMENT':
      return subType === 'BRF' ? 'SE_APARTMENT_BRF' : 'SE_APARTMENT_RENT'
    case 'SWEDISH_HOUSE':
      return 'SE_HOUSE'
    case 'SWEDISH_ACCIDENT':
      return 'SE_ACCIDENT'
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
  const numberCoInsured = searchNumberCoInsured ? parseNumber(searchNumberCoInsured) : undefined
  if (numberCoInsured !== undefined) updatedSearchParams.delete(SearchParam.NumberCoInsured)

  const isStudent = parseBoolean(searchParams.get(SearchParam.Student)?.toLowerCase())
  if (isStudent !== undefined) updatedSearchParams.delete(SearchParam.Student)

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
    default:
      return undefined
  }
}

export const parseShopSessionCreatePartnerSearchParams = (
  searchParams: URLSearchParams,
): [Partial<ShopSessionCreatePartnerMutationVariables['input']>, URLSearchParams] => {
  const updatedSearchParams = new URLSearchParams(searchParams.toString())

  const externalRequestId = updatedSearchParams.get(SearchParam.ExternalRequestId)
  if (externalRequestId) updatedSearchParams.delete(SearchParam.ExternalRequestId)

  const externalMemberId = updatedSearchParams.get(SearchParam.ExternalMemberId)
  if (externalMemberId) updatedSearchParams.delete(SearchParam.ExternalMemberId)

  return [
    {
      ...(externalRequestId && { partnerRequestId: externalRequestId }),
      ...(externalMemberId && { externalMemberId }),
    },
    updatedSearchParams,
  ]
}
