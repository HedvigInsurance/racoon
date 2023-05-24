import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSetGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { getShopSessionId } from '@/services/shopSession/ShopSession.helpers'

export const useDebugShopSession = () => {
  const router = useRouter()
  const setGlobalBanner = useSetGlobalBanner()

  const isDebug = router.query.debug === 'session'
  useEffect(() => {
    if (!router.isReady || !isDebug) return

    const shopSessionId = getShopSessionId()
    if (!shopSessionId) return

    setGlobalBanner(`ShopSession ID: ${shopSessionId}`)
  }, [router.isReady, isDebug, setGlobalBanner])
}
