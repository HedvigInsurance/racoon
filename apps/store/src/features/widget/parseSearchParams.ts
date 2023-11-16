import Personnummer from 'personnummer'
import { ShopSessionCustomerUpdateInput } from '@/services/apollo/generated'

// Search Params from Partner Widget
enum SearchParam {
  Email = 'email',
  Ssn = 'ssn',

  ProductType = 'productType',
  ApartmentSubType = 'subType',
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
