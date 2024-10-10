'use client'
import { Banner } from '@/components/Banner/Banner'
import { useGlobalBannerValue, useDismissBanner } from '@/components/GlobalBanner/globalBannerState'
import { useDebugShopSessionId } from '@/utils/useDebugShopSessionId'

const GlobalBanner = () => {
  const globalBanner = useGlobalBannerValue()
  const dismissBanner = useDismissBanner()

  // Show standard banners if applicable
  useDebugShopSessionId()

  if (globalBanner == null) return null

  return (
    <Banner variant={globalBanner.variant} onClose={() => dismissBanner(globalBanner.id)}>
      {globalBanner.content}
    </Banner>
  )
}
export default GlobalBanner
