'use client'
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
  partner?: string
}

export const TrackingProvider = (props: Props) => {
  const { countryCode } = useCurrentCountry()

  const data = useMemo<Tracking['context']>(() => {
    return {
      shopSessionId: props.shopSession?.id,
      ...parsePriceIntentData(props.priceIntent?.data ?? {}),
      ...(props.productData && parseProductData(props.productData)),
      partner: props.partner,
      countryCode,
    }
  }, [
    props.shopSession?.id,
    props.priceIntent?.data,
    props.productData,
    props.partner,
    countryCode,
  ])

  return <TrackingContext.Provider value={data}>{props.children}</TrackingContext.Provider>
}

const parsePriceIntentData = (data: Record<string, unknown>): Tracking['context'] => {
  const numberCoInsured = parseNumber(data.numberCoInsured)

  return {
    numberOfPeople: numberCoInsured ? numberCoInsured + 1 : undefined,
    zipCode: typeof data.zipCode === 'string' ? data.zipCode : undefined,
    city: typeof data.city === 'string' ? data.city : undefined,
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
