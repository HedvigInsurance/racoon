import { useCallback, useRef } from 'react'
import { gtmGtag } from '@/services/gtm'

export type OneTrustApi = {
  OnConsentChanged: (callback: () => void) => void
  IsAlertBoxClosed: () => boolean
  AllowAll: () => void
  ToggleInfoDisplay: () => void
  SetAlertBoxClosed: () => void
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
  }, [])

  return saveConsent
}
