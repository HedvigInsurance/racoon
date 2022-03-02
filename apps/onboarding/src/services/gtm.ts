import { useCurrentLocale } from '@/lib/l10n'
import { useEffect } from 'react'

export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

export const pageview = (url: string, title: string) => {
  pushToGTMDataLayer({
    event: 'pageview',
    page: url,
  })
}

type GTMUserProperties = {
  market: string
  environment: 'development' | 'production' | 'test'
}

type DataLayerObject = {
  event?: string
  userProperties?: GTMUserProperties
  page?: string
}

/**
 * Track user properties
 */
export const useGTMUserProperties = () => {
  const environment = process.env.NODE_ENV
  const market = useCurrentLocale().marketLabel.toLowerCase()
  
  useEffect(() => {
    pushToGTMDataLayer({
      userProperties: {
        environment,
        market,
      },
    })
  }, [environment, market])
}

export const pushToGTMDataLayer = (obj: DataLayerObject) => {
  window.dataLayer?.push(obj)
}

