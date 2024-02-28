import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { getShopSessionId } from '@/services/shopSession/ShopSession.helpers'

export const useDebugShopSession = () => {
  const searchParams = useSearchParams()
  const isDebug = searchParams?.get('debug') === 'session'

  const { addBanner } = useGlobalBanner()

  useEffect(() => {
    if (!isDebug) return

    const shopSessionId = getShopSessionId()
    if (!shopSessionId) return

    addBanner(`ShopSession ID: ${shopSessionId}`, 'info', { force: true })
  }, [isDebug, addBanner])
}
