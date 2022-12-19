import { useEffect } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Track } from '@/services/Track/Track'

export const useTrackShopSession = () => {
  const { shopSession } = useShopSession()
  const shopSessionId = shopSession?.id
  useEffect(() => {
    if (shopSessionId) {
      Track.addContext('shopSessionId', shopSessionId)
    }
  }, [shopSessionId])
}
