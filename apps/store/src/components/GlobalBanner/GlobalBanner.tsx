'use client'
import { useAtomValue, useSetAtom } from 'jotai'
import { Banner } from '@/components/Banner/Banner'
import {
  dismissedBannerIdAtom,
  globalBannerAtom,
} from '@/components/GlobalBanner/globalBannerState'
import { useDebugShopSessionId } from '@/utils/useDebugShopSessionId'

const GlobalBanner = () => {
  const globalBanner = useAtomValue(globalBannerAtom)
  const setDismissedBannerId = useSetAtom(dismissedBannerIdAtom)

  // Show standard banners if applicable
  useDebugShopSessionId()

  if (globalBanner == null) return null

  return (
    <Banner variant={globalBanner.variant} onClose={() => setDismissedBannerId(globalBanner.id)}>
      <span dangerouslySetInnerHTML={{ __html: globalBanner.content }} />
    </Banner>
  )
}
export default GlobalBanner
