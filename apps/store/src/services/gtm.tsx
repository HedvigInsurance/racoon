/**
 * Based on https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager
 */

import { datadogLogs } from '@datadog/browser-logs'
import Script from 'next/script'
import type { TrackingEvent } from '@/services/Tracking/Tracking'
import type { CountryCode } from '@/utils/l10n/types'

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
const GTM_ENVIRONMENT = process.env.NEXT_PUBLIC_GTM_ENV

const GTM_ENVIRONMENTS = ['local', 'staging', 'prod'] as const
type GTMEnvironment = (typeof GTM_ENVIRONMENTS)[number]

const getGtmEnvironment = () => {
  if (isGTMEnvironment(GTM_ENVIRONMENT)) return GTM_ENVIRONMENT

  const environments = GTM_ENVIRONMENTS.join('|')
  const message = `Unknown GTM environment ${GTM_ENVIRONMENT}, expected <${environments}>`
  if (GTM_ID) {
    throw new Error(message)
  } else {
    datadogLogs.logger.warn(message)
  }
}

const isGTMEnvironment = (value: unknown): value is GTMEnvironment => {
  return GTM_ENVIRONMENTS.includes(value as GTMEnvironment)
}

type GTMUserProperties = {
  siteVersion: string
  country: CountryCode
  environment?: GTMEnvironment
}

type GTMPageData = {
  page: string
  title: string
}

export type GTMEcommerceData = Record<string, unknown>

export type GTMShopSessionData = {
  id: string | undefined
}

type DataLayerObject = {
  event?: string
  userProperties?: GTMUserProperties
  offerData?: Record<string, unknown>
  eventData?: Record<string, string>
  OnetrustActiveGroups?: string
  pageData?: GTMPageData
  ecommerce?: GTMEcommerceData
  shopSession?: GTMShopSessionData
  user_id?: string
}

type DataLayerArray = Array<unknown>

export type EcommerceEvent = {
  event: TrackingEvent
  ecommerce: GTMEcommerceData
  shopSession: GTMShopSessionData
  // https://support.google.com/google-ads/answer/9917012?hl=en
  new_customer?: boolean
  price_match?: {
    exposure_matched: boolean
    price_matched: boolean
  }
}

// Needed in case event is sent before GTM is loaded, see https://github.com/HedvigInsurance/racoon/commit/38dbb73d552a590f652bbbe537d4d8ed4b0399f8
export const pushToGTMDataLayer = (obj: DataLayerObject | DataLayerArray) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!window.dataLayer) window.dataLayer = []
  // Clear the previous ecommerce object
  if (!Array.isArray(obj) && typeof obj.ecommerce !== 'undefined') {
    window.dataLayer.push({ ecommerce: null })
  }
  window.dataLayer.push(obj)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function gtmGtag(...args: Array<any>) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!window.dataLayer) window.dataLayer = []
  // We need to forward arguments directly for it to work
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

export const GTMAppScript = () => {
  if (!GTM_ID) return null

  return (
    <Script
      id="gtag-base"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer', '${GTM_ID}');`,
      }}
    />
  )
}

export const GTMBodyScript = () => {
  if (!GTM_ID) return null

  return (
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
}

export const initializeGtm = (countryCode: CountryCode) => {
  pushToGTMDataLayer({
    event: 'initiate_gtm',
    userProperties: {
      siteVersion: 'racoon',
      country: countryCode,
      environment: getGtmEnvironment(),
    },
  })

  // Update OneTrust active groups for necessary category on app init
  pushToGTMDataLayer({
    event: 'OneTrustGroupsUpdated',
    OnetrustActiveGroups: ',C0001,',
  })
}

// https://developers.google.com/analytics/devguides/collection/ga4/user-id?client_type=gtm#send_user_ids
export const setUserId = (userId: string) => {
  pushToGTMDataLayer({ user_id: userId })
}
