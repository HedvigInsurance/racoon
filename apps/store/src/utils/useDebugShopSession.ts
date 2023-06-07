import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { getShopSessionId } from '@/services/shopSession/ShopSession.helpers'

export const useDebugShopSession = () => {
  const router = useRouter()
  const { addBanner } = useGlobalBanner()

  const isDebug = router.query.debug === 'session'
  useEffect(() => {
    if (!router.isReady || !isDebug) return

    const shopSessionId = getShopSessionId()
    if (!shopSessionId) return

    addBanner(`ShopSession ID: ${shopSessionId}`, 'info', { force: true })
  }, [router.isReady, isDebug, addBanner])
}
