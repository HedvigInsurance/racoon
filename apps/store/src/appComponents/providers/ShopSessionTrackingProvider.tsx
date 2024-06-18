'use client'
import { type ReactNode } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { TrackingProvider } from '@/services/Tracking/TrackingContext'

type Props = { children: ReactNode }
export const ShopSessionTrackingProvider = ({ children }: Props) => {
  const { shopSession } = useShopSession()
  return <TrackingProvider shopSession={shopSession}>{children}</TrackingProvider>
}
