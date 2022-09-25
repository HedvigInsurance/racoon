/**
 * Based on https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager
 */

import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import { useCurrentLocale } from './l10n/useCurrentLocale'

export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

type AppEnvironment = 'development' | 'production' | 'test'

type GTMUserProperties = {
  market: string
  environment: AppEnvironment
}

type GTMPageData = {
  page: string
  title: string
}

type DataLayerObject = {
  event?: string
  userProperties?: GTMUserProperties
  offerData?: Record<string, string>
  eventData?: Record<string, string>
  pageData?: GTMPageData
}

// Needed in case event is sent before GTM is loaded, see https://github.com/HedvigInsurance/racoon/commit/38dbb73d552a590f652bbbe537d4d8ed4b0399f8
const pushToGTMDataLayer = (obj: DataLayerObject) => {
  if (!window.dataLayer) window.dataLayer = []
  window.dataLayer.push(obj)
}

export const GTMAppScript = () => (
  <Script
    id="gtag-base"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', '${GTM_ID}');`,
    }}
  />
)

export const GTMBodyScript = () => (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
      height="0"
      width="0"
      style={{ display: 'none', visibility: 'hidden' }}
      title="GTM"
    />
  </noscript>
)

export const useGTMRouteEvents = () => {
  const router = useRouter()
  const { countryLabel } = useCurrentLocale()

  useEffect(() => {
    const pageview = (url: string) => {
      pushToGTMDataLayer({
        event: 'virtual_page_view',
        pageData: {
          page: url,
          title: document.title,
        },
        userProperties: {
          market: countryLabel,
          environment: process.env.NODE_ENV,
        },
      })
    }

    router.events.on('routeChangeComplete', pageview)

    return () => {
      router.events.off('routeChangeComplete', pageview)
    }
  }, [countryLabel, router.events])
}
