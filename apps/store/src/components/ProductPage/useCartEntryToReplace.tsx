import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const useCartEntryToReplace = () => {
  const searchParams = useSearchParams()
  const cartEntryId = searchParams?.get('replace') as string | undefined
  const { shopSession } = useShopSession()

  return useMemo(
    () => shopSession?.cart.entries.find((item) => item.id === cartEntryId),
    [shopSession?.cart.entries, cartEntryId],
  )
}
