import { clsx } from 'clsx'
import Script from 'next/script'
import { useEffect } from 'react'
import { insurelyIframe } from '@/services/Insurely/InsurelyIframe.css'
import type { Language } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const CUSTOMER_ID = process.env.NEXT_PUBLIC_INSURELY_CUSTOMER_ID!
const IFRAME_URL = 'https://blocks.insurely.com/'
const BOOTSTRAP_SCRIPT_URL = 'https://blocks.insurely.com/assets/bootstrap.js'

enum EventName {
  APP_LOADED = 'APP_LOADED',
  COLLECTION_ID = 'COLLECTION_ID',
  RESULTS = 'RESULTS',
}

// Non-exhaustive list of Insurely iframe messages
type InsurelyMessage =
  | { name: EventName.APP_LOADED }
  | { name: EventName.COLLECTION_ID; value: string }
  | { name: EventName.RESULTS }

type InsurelyIframeProps = {
  configName: string
  className?: string
  onLoaded?: () => void
  onCollection?: (collectionId: string) => void
  onCompleted?: () => void
}

// Insurely iframe docs: https://docs.insurely.com/autofill-and-switcher

export function InsurelyIframe({
  configName,
  className,
  onLoaded,
  onCollection,
  onCompleted,
}: InsurelyIframeProps) {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent<InsurelyMessage>) => {
      switch (data.name) {
        case EventName.APP_LOADED:
          return onLoaded?.()

        case EventName.COLLECTION_ID:
          return onCollection?.(data.value)

        case EventName.RESULTS:
          return onCompleted?.()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onLoaded, onCollection, onCompleted])

  const { language } = useCurrentLocale()
  useEffect(() => {
    setInsurelyConfig({ customerId: CUSTOMER_ID, configName, language })
  }, [language, configName])

  return (
    <>
      <iframe
        id="insurely-data-aggregation"
        title="insurely-data-aggregation"
        src={IFRAME_URL}
        className={clsx(insurelyIframe, className)}
        sandbox="allow-scripts
    allow-same-origin
    allow-popups
    allow-forms
    allow-popups-to-escape-sandbox
    allow-top-navigation"
      />

      <Script strategy="afterInteractive" src={BOOTSTRAP_SCRIPT_URL} />
    </>
  )
}

type InsurelyConfig = {
  customerId?: string
  configName?: string
  company?: string
  ssn?: string
  language?: Language
  showCloseButton?: boolean
  hideResultsView?: boolean
  salesSupportToolSessionId?: string
  multiCompanySelect?: boolean
}

export const setInsurelyConfig = (config: InsurelyConfig) => {
  const insurelyConfig = window.insurely?.config
  window.insurely = {
    config: {
      ...insurelyConfig,
      ...(config.customerId && { customerId: config.customerId }),
      ...(config.configName && { configName: config.configName }),
      ...(config.language && { language: config.language }),

      showCloseButton: config.showCloseButton ?? true,
      dataAggregation: {
        ...insurelyConfig?.dataAggregation,
        ...(config.salesSupportToolSessionId && { sstSessionId: config.salesSupportToolSessionId }),
        ...(config.hideResultsView !== undefined && { hideResultsView: config.hideResultsView }),
        ...(config.multiCompanySelect !== undefined && { multiSelect: config.multiCompanySelect }),
      },
    },
    prefill: {
      dataAggregation: {
        ...window.insurely?.prefill?.dataAggregation,
        ...(config.company && { company: config.company }),
      },
      user: {
        ...window.insurely?.prefill?.user,
        ...(config.ssn && { swedishPersonalNumber: config.ssn }),
      },
    },
  }
}
