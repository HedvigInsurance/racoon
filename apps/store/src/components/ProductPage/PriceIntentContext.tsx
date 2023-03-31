import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import {
  PriceIntentFragmentFragment,
  PriceIntentQueryResult,
  usePriceIntentQuery,
} from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getOffersByPrice } from './PurchaseForm/getOffersByPrice'
import { useSelectedOffer } from './PurchaseForm/useSelectedOffer'

type SetupPriceIntent = (shopSession: ShopSession) => Promise<void>
type ContextValue =
  | readonly [PriceIntentFragmentFragment | undefined, PriceIntentQueryResult, SetupPriceIntent]
  | null

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

  const [, setSelectedOffer] = useSelectedOffer()
  const [priceIntentId, setPriceIntentId] = useState<string | null>(null)
  const result = usePriceIntentQuery({
    skip: !priceIntentId,
    variables: priceIntentId ? { priceIntentId } : undefined,
    onCompleted(data) {
      setSelectedOffer((prev) => {
        const matchingOffer = data.priceIntent.offers.find(
          (item) =>
            item.variant.typeOfContract === prev?.variant.typeOfContract &&
            item.deductible?.displayName === prev?.deductible?.displayName,
        )

        if (matchingOffer) return matchingOffer

        return getOffersByPrice(data.priceIntent.offers)[0]
      })
    },
  })

  const router = useRouter()
  const createNewPriceIntent = useCallback(
    async (shopSession: ShopSession) => {
      const service = priceIntentServiceInitClientSide(apolloClient)
      service.clear(priceTemplate.name, shopSession.id)
      await router.replace(router.asPath)
    },
    [apolloClient, priceTemplate, router],
  )

  useEffect(
    () =>
      onReady(async (shopSession) => {
        const service = priceIntentServiceInitClientSide(apolloClient)
        const priceIntent = await service.getOrCreate({
          priceTemplate,
          productName: productData.name,
          shopSessionId: shopSession.id,
        })
        setPriceIntentId(priceIntent.id)
      }),
    [onReady, apolloClient, priceTemplate, productData.name],
  )

  return [result.data?.priceIntent, result, createNewPriceIntent] as const
}

export const usePriceIntent = () => {
  const contextValue = useContext(PriceIntentContext)
  if (!contextValue) {
    throw new Error('usePriceIntent called outside PriceIntentContext, no value to provide')
  }
  return contextValue
}
