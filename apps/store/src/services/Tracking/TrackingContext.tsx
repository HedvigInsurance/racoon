import { type ReactNode, createContext, useMemo } from 'react'
import { type PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { type Tracking } from './Tracking'

export const TrackingContext = createContext<Tracking['context']>({})

type Props = {
  children: ReactNode
  shopSession?: ShopSession
  priceIntent?: PriceIntent
}

export const TrackingProvider = (props: Props) => {
  const data = useMemo<Tracking['context']>(() => {
    return {
      shopSessionId: props.shopSession?.id,
      ...parseCustomerData(props.shopSession?.customer),
      ...parsePriceIntentData(props.priceIntent?.data ?? {}),
    }
  }, [props.shopSession?.id, props.shopSession?.customer, props.priceIntent?.data])

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
