import { ApolloError, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  ShopSessionCreateMutation,
  ShopSessionQuery,
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from './ShopSession.helpers'
import { ShopSession } from './ShopSession.types'

type ShopSessionContextValue = {
  shopSession: ShopSession | null
  loading: boolean
}

export const ShopSessionContext = createContext<ShopSessionContextValue>({
  shopSession: null,
  loading: true,
})

export const ShopSessionProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()

  const createShopSession = useCreateShopSession({
    onCompleted: ({ shopSessionCreate }) => {
      setShopSessionId(shopSessionCreate.id)
      shopSessionService.save(shopSessionCreate)
    },
  })

  const [shopSessionId, setShopSessionId] = useState(() => {
    const shopSessionId = shopSessionService.shopSessionId()
    if (!shopSessionId && typeof window !== 'undefined') createShopSession()
    return shopSessionId
  })

  const result = useShopSessionQuery({
    shopSessionId,
    onCompleted: ({ shopSession }) => {
      if (shopSession.countryCode !== countryCode) {
        console.warn('ShopSession CountryCode does not match')
        createShopSession()
      }
    },
    onError: (error) => {
      console.warn('ShopSession not found: ', shopSessionId)
      console.warn(error)
      createShopSession()
    },
  })

  const value = useMemo<ShopSessionContextValue>(() => {
    const shopSessionCountryCode = result.data?.shopSession?.countryCode
    return {
      shopSession: shopSessionCountryCode !== countryCode ? null : result.data?.shopSession ?? null,
      loading: result.loading,
    }
  }, [result, countryCode])

  return <ShopSessionContext.Provider value={value}>{children}</ShopSessionContext.Provider>
}

export const useShopSession = () => {
  return useContext(ShopSessionContext)
}

const useCreateShopSession = ({ onCompleted }: ShopSessionOperationParams) => {
  const { countryCode } = useCurrentLocale()
  const [createShopSession] = useShopSessionCreateMutation({
    variables: { countryCode },
    onCompleted,
  })
  return createShopSession
}

type ShopSessionOperationParams = {
  onCompleted: (data: ShopSessionCreateMutation) => void
}

const useShopSessionQuery = ({ shopSessionId, onCompleted, onError }: UseShopSessionParams) => {
  return useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    onCompleted,
    onError,
    ssr: false,
  })
}

type UseShopSessionParams = {
  shopSessionId: string | null
  onCompleted: (data: ShopSessionQuery) => void
  onError: (error: ApolloError) => void
}

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
