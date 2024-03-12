'use client'
import { useDiscountBanner } from '@/utils/useDiscountBanner'

// Optimization - this effect should run in component without children to avoid rerenders
export const DiscountBannerTrigger = () => {
  useDiscountBanner()
  return null
}
