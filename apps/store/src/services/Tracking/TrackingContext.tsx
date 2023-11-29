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
    }
  }, [props.shopSession?.id, props.shopSession?.customer])

  return <TrackingContext.Provider value={data}>{props.children}</TrackingContext.Provider>
}

const parseCustomerData = (data: ShopSession['customer']): Tracking['context'] => ({
  customerFirstName: data?.firstName,
  customerLastName: data?.lastName,
  customerEmail: data?.email,
})
