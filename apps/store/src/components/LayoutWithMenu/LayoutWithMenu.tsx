import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { ReactNode, createContext, useMemo, useRef } from 'react'
import { SiteFooter, SiteFooterProps } from '@/components/SiteFooter/SiteFooter'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import {
  useShopSessionCreateMutation,
  useShopSessionQuery as useShopSessionApolloQuery,
} from '@/services/apollo/generated'
import { setupShopSessionServiceClientSide } from '@/services/shopSession/ShopSession.helpers'
import { TopMenu } from '../TopMenu/TopMenu'

const Wrapper = styled.main({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

type LayoutWithMenuProps = {
  children: ReactNode
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  const router = useRouter()
  const handleChangeLocale: SiteFooterProps['onChangeLocale'] = (locale) => {
    router.push(router.asPath, undefined, { locale })
  }

  return (
    <ShopSessionContextProvider>
      <Wrapper>
        <FixedHeader>
          <TopMenu />
        </FixedHeader>
        {children}
        <SiteFooter onChangeLocale={handleChangeLocale} />
      </Wrapper>
    </ShopSessionContextProvider>
  )
}

const FixedHeader = styled.header({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

function ShopSessionContextProvider({ children }: { children: ReactNode }) {
  const { value } = useShopSessionContextProvider()
  return <ShopSessionContext.Provider value={value}>{children}</ShopSessionContext.Provider>
}

// FIXME: Move to custom App component, extract to own module
export const ShopSessionContext = createContext(null as any)

function useShopSessionContextProvider() {
  const resultRef = useRef({ called: false } as any)

  const { countryCode } = useCurrentLocale()
  const shopSessionService = useShopSessionService()

  const [createShopSession] = useShopSessionCreateMutation({
    variables: { countryCode },
    onCompleted({ shopSessionCreate }) {
      console.log('created', shopSessionCreate, resultRef.current.id)
      // DEBUG: Comment for local development
      // shopSessionService.save(shopSessionCreate)
    },
  })

  const shopSessionId = shopSessionService.shopSessionId()

  const queryResult = useShopSessionApolloQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: !shopSessionId,
    onCompleted: ({ shopSession }: any) => {
      if (shopSession.countryCode !== countryCode) {
        createShopSession()
      }
    },
  })

  const contextValue = useMemo(
    () => ({
      // Lazy so that we don't create session until it's first needed
      querySession() {
        if (!resultRef.current.result) {
          resultRef.current.result = queryResult
          // FIXME: Re-create session on countryCode mismatch
          if (!shopSessionService.shopSessionId()) {
            setTimeout(() => createShopSession(), 0)
          }
        }
        return resultRef.current.result
      },
    }),
    [queryResult, createShopSession, shopSessionService],
  )

  Object.assign(resultRef.current, {
    value: contextValue,
  })
  return resultRef.current
}

const useShopSessionService = () => {
  const apolloClient = useApolloClient()
  return setupShopSessionServiceClientSide(apolloClient)
}
