import Script from 'next/script'
import { useEffect, useState } from 'react'
import { GTMAppScript } from '@/services/gtm'
/* eslint-disable @next/next/no-sync-scripts */

const SCRIPT_ID = {
  // Could be useful for testing changes on OneTrust side
  TEST: '628f5fee-1891-418c-9ed2-f893b8a3998a-test',
  PRODUCTION: '628f5fee-1891-418c-9ed2-f893b8a3998a',
}

type OneTrustApi = {
  OnConsentChanged: (callback: () => void) => void
  IsAlertBoxClosed: () => boolean
}

export function CookieConsentLoader() {
  // Optimization: start loading GTM after cookie consent has been given. Fixes negative effects of preloading GTM
  // - lots of GTM activity triggered immediately on consent, sync -> bad INP
  // - GTM resources taking network brandwidth on initial load when they have no chance to be useful yet
  const isConsentReady = useIsConsentReady()
  return (
    <>
      <Script
        id="onetrust-loader"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        data-document-language="true"
        type="text/javascript"
        data-domain-script={SCRIPT_ID.PRODUCTION}
      />
      {isConsentReady && <GTMAppScript />}
    </>
  )
}

// Potential optimization - don't load GTM if user only consented to required cookies
const useIsConsentReady = () => {
  const [isConsentReady, setIsConsentReady] = useState(false)
  useEffect(() => {
    ;(window as any).OptanonWrapper = function () {
      const OneTrust = (window as any).OneTrust as OneTrustApi
      if (OneTrust.IsAlertBoxClosed()) {
        setIsConsentReady(true)
      } else {
        OneTrust.OnConsentChanged(() => {
          setIsConsentReady(true)
        })
      }
    }
  }, [])
  return isConsentReady
}
