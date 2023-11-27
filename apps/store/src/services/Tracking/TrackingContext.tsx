import { type ReactNode, createContext, useMemo } from 'react'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { type Tracking } from './Tracking'

export const TrackingContext = createContext<Tracking['context']>({})

type Props = {
  children: ReactNode
  shopSession?: ShopSession
}

export const TrackingProvider = (props: Props) => {
  const data = useMemo<Tracking['context']>(() => {
    return { shopSessionId: props.shopSession?.id }
  }, [props.shopSession?.id])

  return <TrackingContext.Provider value={data}>{props.children}</TrackingContext.Provider>
}
