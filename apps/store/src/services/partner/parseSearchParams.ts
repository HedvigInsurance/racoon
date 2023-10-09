import Personnummer from 'personnummer'
import { PartnerWidgetInitInput, ShopSessionCustomerUpdateInput } from '@/services/apollo/generated'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { isIsoLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

enum SearchParam {
  // Needs to be added when doing the redirect
  Locale = 'locale',

  PartnerId = 'partnerId',
  ExternalMemberId = 'externalMemberId',
  ExternalRequestId = 'requestId',

  ProductType = 'productType',
  ApartmentSubType = 'subType',

  // Is anyone using this?
  Student = 'student',

  Email = 'email',
  Ssn = 'ssn',

  // TODO: No longer used?
  PhoneNumber = 'phoneNumber',
  BirthDate = 'birthDate',
  FirstName = 'firstName',
  LastName = 'lastName',

  StreetAddress = 'street',
  ZipCode = 'zipCode',
  City = 'city',
  LivingSpace = 'livingSpace',
  NumberCoInsured = 'coInsured',
}

type Data = {
  locale: RoutingLocale
  productName: string
  partnerWidgetInitVariables: PartnerWidgetInitInput
  customerData: Omit<ShopSessionCustomerUpdateInput, 'shopSessionId'>
  priceIntentData: Record<string, unknown>
}

export const parseSearchParams = (searchParams: URLSearchParams): Data => {
  const searchLocale = searchParams.get(SearchParam.Locale)
  const locale = isIsoLocale(searchLocale) ? searchLocale : FALLBACK_LOCALE
  const routingLocale = toRoutingLocale(locale)

  const productType = searchParams.get(SearchParam.ProductType)
  const apartmentSubType = searchParams.get(SearchParam.ApartmentSubType)
  const productName = getProductName(productType, apartmentSubType)

  const partnerId = searchParams.get(SearchParam.PartnerId)
  if (partnerId === null) throw new Error(`Missing partnerId`)
  const externalMemberId = searchParams.get(SearchParam.ExternalMemberId)
  const externalRequestId = searchParams.get(SearchParam.ExternalRequestId)
  const partnerWidgetInitVariables: Data['partnerWidgetInitVariables'] = {
    countryCode: getCountryByLocale(routingLocale).countryCode,
    partnerId,
    ...(externalMemberId && { externalMemberId }),
    ...(externalRequestId && { externalRequestId }),
  }

  const searchSsn = searchParams.get(SearchParam.Ssn)
  let ssn: string | undefined = undefined
  if (searchSsn && Personnummer.valid(searchSsn)) {
    ssn = Personnummer.parse(searchSsn).format(true)
  }
  const email = searchParams.get(SearchParam.Email)
  const customerData: Data['customerData'] = {
    ssn,
    ...(email && { email }),
  }

  const street = searchParams.get(SearchParam.StreetAddress)
  const zipCode = searchParams.get(SearchParam.ZipCode)
  const city = searchParams.get(SearchParam.City)
  const searchLivingSpace = searchParams.get(SearchParam.LivingSpace)
  const livingSpace = searchLivingSpace ? parseNumber(searchLivingSpace) : undefined
  const searchNumberCoInsured = searchParams.get(SearchParam.NumberCoInsured)
  const numberCoInsured = searchNumberCoInsured ? parseNumber(searchNumberCoInsured) : undefined

  return {
    locale: routingLocale,
    productName,
    partnerWidgetInitVariables,
    customerData,
    priceIntentData: {
      ...(street && { street }),
      ...(zipCode && { zipCode }),
      ...(city && { city }),
      ...(livingSpace && { livingSpace }),
      ...(numberCoInsured && { numberCoInsured }),
    },
  }
}

const parseNumber = (value: string): number | undefined => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? undefined : parsed
}

const getProductName = (productType: string | null, subType: string | null) => {
  switch (productType) {
    case 'SWEDISH_APARTMENT':
      return subType === 'BRF' ? 'SE_APARTMENT_BRF' : 'SE_APARTMENT_RENT'
    case 'SWEDISH_HOUSE':
      return 'SE_HOUSE'
    case 'SWEDISH_ACCIDENT':
      return 'SE_ACCIDENT'
    default:
      return 'SE_APARTMENT_RENT'
  }
}
