import { useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { PriceIntentQueryResult, usePriceIntentLazyQuery } from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

type PriceIntentResult = PriceIntentQueryResult

export const PriceIntentContext = createContext<PriceIntentResult | null>(null)

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

  const productName = productData.name
  const priceIntentService = useMemo(() => {
    return priceIntentServiceInitClientSide(apolloClient)
  }, [apolloClient])

  useEffect(() => {
    return onReady((shopSession) => {
      priceIntentService
        .getOrCreate({ priceTemplate, productName, shopSessionId: shopSession.id })
        .then((priceIntent) => {
          fetchQuery({
            variables: { priceIntentId: priceIntent.id },
          })
        })
    })
  }, [fetchQuery, onReady, priceIntentService, priceTemplate, productName])

  return queryResult
}

export const usePriceIntent = () => {
  const queryResult = useContext(PriceIntentContext)
  if (!queryResult) {
    throw new Error('usePriceIntent called outside PriceIntentContext, no value to provide')
  }
  return queryResult
}
