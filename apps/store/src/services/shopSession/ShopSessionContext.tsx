import { QueryHookOptions, useApolloClient } from '@apollo/client'
import { createContext, PropsWithChildren, useContext, useEffect, useRef } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  Exact,
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
  creating?: boolean
}

export const ShopSessionContext = createContext<ShopSessionContextValue>({
  shopSession: null,
  loading: true,
})

export const ShopSessionProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()
  const resultRef = useRef<ShopSessionContextValue>()

  const createShopSession = useCreateShopSession({
    onCompleted: ({ shopSessionCreate }) => {
      shopSessionService.save(shopSessionCreate)
    },
  })

  // FIXME: Duplicate state, not neede
  // const [shopSessionId, setShopSessionId] = useState(() => {
  //   const shopSessionId = shopSessionService.shopSessionId()
  //   console.log('.', typeof resultRef.current)
  //   if (!shopSessionId && typeof window !== 'undefined' && !resultRef.current) {
  //     console.log('isc', typeof resultRef.current)
  //     createShopSession()
  //   }
  //   return shopSessionId
  // })
  const shopSessionId = shopSessionService.shopSessionId()

  const result = useShopSessionQuery({
    shopSessionId,
    onCompleted: ({ shopSession }) => {
      if (shopSession.countryCode !== countryCode) {
        console.warn('ShopSession CountryCode does not match')
        createShopSession()
      }
    },
    onError: (error) => {
      // FIXME: Check with Robin
      // if ((error.networkError as ServerError)?.statusCode === 404) {
      //   createShopSession()
      // }
      console.warn('ShopSession not found: ', shopSessionId, error)
      createShopSession()
    },
  })

  const shopSessionCountryCode = result.data?.shopSession?.countryCode
  resultRef.current = Object.assign(resultRef.current ?? {}, {
    shopSession: shopSessionCountryCode !== countryCode ? null : result.data?.shopSession ?? null,
    loading: result.loading,
    creating: false,
  })

  // Has to be wrapped to prevent duplicate execution
  useEffect(() => {
    // FIXME: isBrowser()
    if (typeof window !== 'undefined' && !shopSessionId && !resultRef.current?.creating) {
      createShopSession()
    }
    // Only run on init, ignore dependencies
    // eslint-disable-next-line
  }, [])

  return (
    <ShopSessionContext.Provider value={resultRef.current}>{children}</ShopSessionContext.Provider>
  )
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

const useShopSessionQuery = ({ shopSessionId, ...rest }: UseShopSessionParams) => {
  return useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    ssr: false,
    ...rest,
  })
}

type UseShopSessionParams = {
  shopSessionId: string | null
} & Omit<QueryHookOptions<ShopSessionQuery, Exact<{ shopSessionId: string }>>, 'variables'>

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
