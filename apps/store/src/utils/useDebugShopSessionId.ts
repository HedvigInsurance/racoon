import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useSetGlobalBanner } from '@/components/GlobalBanner/globalBannerState'
import { getShopSessionId } from '@/services/shopSession/ShopSession.helpers'

export const useDebugShopSessionId = () => {
  const searchParams = useSearchParams()
  const isDebug = searchParams?.has('debug', 'session')
  const setGlobalBanner = useSetGlobalBanner()

  useEffect(() => {
    if (!isDebug) return

    // Performance: `useShopSession` would've led to extra rerenders, we only want an ID
    const shopSessionId = getShopSessionId()
    if (!shopSessionId) return

    setGlobalBanner(
      { id: 'shopSessionId', content: `ShopSession ID: ${shopSessionId}`, variant: 'info' },
      { force: true },
    )
  }, [isDebug, setGlobalBanner])
}
