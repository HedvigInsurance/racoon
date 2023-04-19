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
  ProductOffer,
  usePriceIntentQuery,
} from '@/services/apollo/generated'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCartEntryToReplace } from './ProductPage'
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
  const entryToReplace = useCartEntryToReplace()
  const [priceIntentId, setPriceIntentId] = useState<string | null>(null)
  const result = usePriceIntentQuery({
    skip: !priceIntentId,
    variables: priceIntentId ? { priceIntentId } : undefined,
    onCompleted(data) {
      setSelectedOffer((prev) => {
        if (prev) {
          const matchingOffer = data.priceIntent.offers.find((item) => compareOffer(item, prev))
          if (matchingOffer) return matchingOffer
        }

        if (entryToReplace) {
          const matchingReplaceOffer = data.priceIntent.offers.find((item) =>
            compareOffer(item, entryToReplace),
          )
          if (matchingReplaceOffer) return matchingReplaceOffer
        }

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

type ComparableProductOffer = Pick<ProductOffer, 'deductible'> & {
  variant: Pick<ProductOffer['variant'], 'typeOfContract'>
}

const compareOffer = (a: ComparableProductOffer, b: ComparableProductOffer) => {
  if (a.variant.typeOfContract !== b.variant.typeOfContract) return false
  if (JSON.stringify(a.deductible) !== JSON.stringify(b.deductible)) return false
  return true
}
