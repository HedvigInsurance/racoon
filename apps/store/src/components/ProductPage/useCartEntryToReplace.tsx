import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const CART_ENTRY_TO_REPLACE_QUERY_PARAM = 'replace'

export const useCartEntryToReplace = () => {
  const searchParams = useSearchParams()
  const cartEntryId = searchParams?.get(CART_ENTRY_TO_REPLACE_QUERY_PARAM) as string | undefined
  const { shopSession } = useShopSession()

  return useMemo(
    () => shopSession?.cart.entries.find((item) => item.id === cartEntryId),
    [shopSession?.cart.entries, cartEntryId],
  )
}
