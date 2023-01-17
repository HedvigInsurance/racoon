import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect } from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import {
  PriceIntentFragmentFragment,
  PriceIntentQueryResult,
  usePriceIntentLazyQuery,
} from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type PriceIntentResult = PriceIntentQueryResult & {
  priceIntent?: PriceIntentFragmentFragment
}
type SetupPriceIntent = (shopSession: ShopSession) => Promise<void>
type ContextValue = readonly [PriceIntentResult, SetupPriceIntent] | null

export const PriceIntentContext = createContext<ContextValue>(null)

type Props = PropsWithChildren<unknown>

export const PriceIntentContextProvider = ({ children }: Props) => {
  const contextValue = usePriceIntentContextValue()
  return <PriceIntentContext.Provider value={contextValue}>{children}</PriceIntentContext.Provider>
}

const usePriceIntentContextValue = () => {
  const { priceTemplate, productData } = useProductPageContext()
  const apolloClient = useApolloClient()
  const { onReady } = useShopSession()
  const [fetchQuery, queryResult] = usePriceIntentLazyQuery({
    // Prevent network requests and ensure we trigger an error on cache miss, which should never happen
    fetchPolicy: 'cache-only',
  })

  const { priceIntent } = queryResult.data ?? {}
  const result = Object.assign(queryResult, { priceIntent }) satisfies PriceIntentResult

  const setupPriceIntent = useCallback(
    async (shopSession: ShopSession) => {
      const service = priceIntentServiceInitClientSide(apolloClient)
      const priceIntent = await service.getOrCreate({
        priceTemplate,
        productName: productData.name,
        shopSessionId: shopSession.id,
      })
      await fetchQuery({
        variables: { priceIntentId: priceIntent.id },
      })
    },
    [apolloClient, fetchQuery, priceTemplate, productData.name],
  )

  useEffect(() => onReady(setupPriceIntent), [onReady, setupPriceIntent])

  return [result, setupPriceIntent] as const
}

export const usePriceIntent = () => {
  const contextValue = useContext(PriceIntentContext)
  if (!contextValue) {
    throw new Error('usePriceIntent called outside PriceIntentContext, no value to provide')
  }
  return contextValue
}
