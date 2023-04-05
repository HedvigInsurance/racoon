import type { NextPage } from 'next'
import { SSRConfig } from 'next-i18next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'

type PageWithLayout<T = Record<string, unknown>> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode
}

declare module 'next' {
  export type NextPageWithLayout<T = Record<string, unknown>> = PageWithLayout<T>
}

type GlobalAppProps = SSRConfig & {
  [SHOP_SESSION_PROP_NAME]?: string
}

declare module 'next/app' {
  export type AppPropsWithLayout = AppProps<GlobalAppProps> & {
    Component: PageWithLayout
  }
}

type TrustlyInitFunction = (
  endUserID: string,
  merchantUsername: string,
  merchantCallback: MerchantCallbackFunction,
  options?: TrustlyOptions,
) => Promise<TrustlyInitStatus>
type TrustlyInitStatus = 'FirstTimeUser' | 'ReturningUser'

type MerchantCallbackFunction = (data: MerchantCallbackData) => void
type MerchantCallbackData = { accountId: string }
type TrustlyOptions = { locale: string }

declare global {
  interface Window {
    TrustlyWidget: {
      init: TrustlyInitFunction
    }
    dataLayer: DataLayerObject[]

    // Customer First (C1)
    customerFirstAPI?: {
      openWidget(): void
      closeWidget(): void
    }

    // Insurely
    insurely?: {
      config?: InsurelyConfig
      prefill?: InsurelyPrefill
    }
  }
}

type InsurelyConfig = {
  customerId?: string
  configName?: string
  showCloseButton?: boolean
  language?: 'en' | 'no' | 'sv' | 'da'
  dataAggregation?: {
    hideResultsView?: boolean
  }
}

type InsurelyPrefill = {
  user?: {
    swedishPersonalNumber?: string
  }
  dataAggregation?: {
    company?: string
  }
}
