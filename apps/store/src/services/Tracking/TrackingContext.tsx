import { type ReactNode, createContext, useMemo } from 'react'
import { type ProductData } from '@/components/ProductData/ProductData.types'
import { type PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { type Tracking } from './Tracking'

export const TrackingContext = createContext<Tracking['context']>({})

type Props = {
  children: ReactNode
  shopSession?: ShopSession
  priceIntent?: PriceIntent
  productData?: ProductData
}

export const TrackingProvider = (props: Props) => {
  const { countryCode } = useCurrentCountry()

  const data = useMemo<Tracking['context']>(() => {
    return {
      shopSessionId: props.shopSession?.id,
      ...parseCustomerData(props.shopSession?.customer),
      ...parsePriceIntentData(props.priceIntent?.data ?? {}),
      ...(props.productData && parseProductData(props.productData)),
      countryCode,
    }
  }, [
    props.shopSession?.id,
    props.shopSession?.customer,
    props.priceIntent?.data,
    props.productData,
    countryCode,
  ])

  return <TrackingContext.Provider value={data}>{props.children}</TrackingContext.Provider>
}

const parseCustomerData = (data: ShopSession['customer']): Tracking['context'] => ({
  customerFirstName: data?.firstName,
  customerLastName: data?.lastName,
  customerEmail: data?.email,
})

const parsePriceIntentData = (data: Record<string, unknown>): Tracking['context'] => {
  const numberCoInsured = parseNumber(data.numberCoInsured)

  return {
    numberOfPeople: numberCoInsured ? numberCoInsured + 1 : undefined,
    zipCode: data.zipCode,
    city: data.city,
  }
}

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') parseInt(value, 10)
  return undefined
}

const parseProductData = (data: ProductData): Tracking['context'] => ({
  productId: data.id,
  productDisplayName: data.displayNameFull,
})
