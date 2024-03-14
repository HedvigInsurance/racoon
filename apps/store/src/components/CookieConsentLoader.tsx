import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GTMAppScript, gtmGtag } from '@/services/gtm'

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
  const calledRef = useRef(false)
  const saveConsent = useCallback(() => {
    // Double invoke in dev mode is harmful, prevent it
    if (calledRef.current) return

    const activeGroups = (window as any).OnetrustActiveGroups
    if (typeof activeGroups !== 'string') {
      console.warn('Failed to read window.OnetrustActiveGroups')
      return
    }
    const consentGroups = {
      required: 'granted',
      performance: activeGroups.includes(',C0002,') ? 'granted' : 'denied',
      functional: activeGroups.includes(',C0003,') ? 'granted' : 'denied',
      targeting: activeGroups.includes(',C0004,') ? 'granted' : 'denied',
      social: activeGroups.includes(',C0005,') ? 'granted' : 'denied',
    }
    gtmGtag('consent', 'update', {
      ad_storage: consentGroups.targeting,
      ad_user_data: consentGroups.targeting,
      ad_personalization: consentGroups.targeting,
      analytics_storage: consentGroups.performance,
      personalization_storage: consentGroups.required,
      functionality_storage: consentGroups.required,
      security_storage: consentGroups.required,
    })
    setIsConsentReady(true)
  }, [])
  useEffect(() => {
    ;(window as any).OptanonWrapper = function () {
      const OneTrust = (window as any).OneTrust as OneTrustApi
      if (OneTrust.IsAlertBoxClosed()) {
        saveConsent()
      } else {
        OneTrust.OnConsentChanged(saveConsent)
      }
    }
  }, [saveConsent])
  return isConsentReady
}
