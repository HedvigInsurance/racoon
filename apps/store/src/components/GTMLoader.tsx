import { useCallback, useEffect, useRef, useState } from 'react'
import { GTMAppScript, gtmGtag, pushToGTMDataLayer } from '@/services/gtm'

export type OneTrustApi = {
  OnConsentChanged: (callback: () => void) => void
  IsAlertBoxClosed: () => boolean
  AllowAll: () => void
  ToggleInfoDisplay: () => void
  SetAlertBoxClosed: () => void
}

export function GTMLoader() {
  // Optimization: start loading GTM after cookie consent has been given. Fixes negative effects of preloading GTM
  // - lots of GTM activity triggered immediately on consent, sync -> bad INP
  // - GTM resources taking network brandwidth on initial load when they have no chance to be useful yet
  const isConsentReady = useIsConsentReady()
  if (!isConsentReady) return null

  return <GTMAppScript />
}

// Potential optimization - don't load GTM if user only consented to required cookies
export function useIsConsentReady() {
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

export function useSaveConsent() {
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

    pushToGTMDataLayer({
      event: 'OneTrustGroupsUpdated',
      OnetrustActiveGroups: activeGroups,
      eventData: {
        event_category: 'manual OneTrust',
      },
    })
  }, [])

  return saveConsent
}
