'use client'
import { type ReactNode } from 'react'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'

type Props = { children: ReactNode }
export const ShopSessionTrackingProvider = ({ children }: Props) => {
  const shopSessionId = useShopSessionId()
  return <TrackingProvider shopSessionId={shopSessionId}>{children}</TrackingProvider>
}
