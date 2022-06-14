import { useEffect } from 'react'
import { useCurrentLocale } from '@/lib/l10n'

export const pageview = (url: string) => {
  pushToGTMDataLayer({
    event: 'virtual_page_view',
    pageData: {
      page: url,
      title: document.title,
    },
  })
}

type GTMUserProperties = {
  market: string
  environment: 'development' | 'production' | 'test'
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

export const gtmDevScript = {
  head: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=EbOAQbxBh5HL-JxsvnLJRw&gtm_preview=env-114&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', 'GTM-WWMKHK5');`,
  body: `https://www.googletagmanager.com/ns.html?id=GTM-WWMKHK5&gtm_auth=EbOAQbxBh5HL-JxsvnLJRw&gtm_preview=env-114&gtm_cookies_win=x`,
}

export const gtmProdScript = {
  head: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=sIs5wycOuc-PFSf7GPLFYQ&gtm_preview=env-2&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', 'GTM-WWMKHK5');`,
  body: `https://www.googletagmanager.com/ns.html?id=GTM-WWMKHK5&gtm_auth=sIs5wycOuc-PFSf7GPLFYQ&gtm_preview=env-2&gtm_cookies_win=x`,
}
