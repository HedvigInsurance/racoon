import { RESET } from 'jotai/utils'
import { Banner } from '@/components/Banner/Banner'
import { useDebugShopSession } from '@/utils/useDebugShopSession'
import { useGlobalBanner, useGlobalBannerClosed } from './useGlobalBanner'

export const GlobalBanner = () => {
  const [banner, setBanner] = useGlobalBanner()
  const [closed, setIsClosed] = useGlobalBannerClosed()

  useDebugShopSession()

  const handleClose = () => {
    setBanner(RESET)
    setIsClosed(true)
  }

  if (banner === null || closed) return null

  return (
    <Banner variant={banner.variant} handleClose={handleClose}>
      {banner.content}
    </Banner>
  )
}
