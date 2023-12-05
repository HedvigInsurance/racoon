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
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    TrustlyWidget: {
      init: TrustlyInitFunction
    }
    Trustpilot?: {
      loadFromElement: (element: HTMLElement, forceReload?: boolean) => void
    }
    dataLayer: Array<DataLayerObject>

    // Customer First (C1)
    customerFirstAPI?: {
      createWidget(): void
      openWidget(): void
      closeWidget(): void
    }

    // Insurely
    insurely?: {
      config?: InsurelyConfig
      prefill?: InsurelyPrefill
    }

    // React Native
    ReactNativeWebView?: {
      postMessage: (message: string) => void
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
    multiSelect?: boolean
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
