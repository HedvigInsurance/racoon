import { Banner } from '@/components/Banner/Banner'
import { useDebugShopSession } from '@/utils/useDebugShopSession'
import { useGlobalBanner } from './useGlobalBanner'

export const GlobalBanner = () => {
  const { banner, dismissBanner } = useGlobalBanner()

  useDebugShopSession()

  const handleClose = () => {
    dismissBanner()
  }

  if (banner === null) return null

  return (
    <Banner variant={banner.variant} handleClose={handleClose}>
      {banner.content}
    </Banner>
  )
}
