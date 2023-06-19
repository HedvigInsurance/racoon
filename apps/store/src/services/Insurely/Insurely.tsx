// Documentation: https://docs.insurely.com/autofill-and-switcher

import styled from '@emotion/styled'
import Script from 'next/script'
import { useEffect } from 'react'
import { Language } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const CUSTOMER_ID = process.env.NEXT_PUBLIC_INSURELY_CUSTOMER_ID as string
const IFRAME_URL = 'https://blocks.insurely.com/'
const BOOTSTRAP_SCRIPT_URL = 'https://blocks.insurely.com/assets/bootstrap.js'

enum EventName {
  APP_LOADED = 'APP_LOADED',
  APP_CLOSE = 'APP_CLOSE',
  COLLECTION_ID = 'COLLECTION_ID',
  RESULTS = 'RESULTS',
}

// Non-exhaustive list of Insurely iframe messages
type InsurelyMessage =
  | { name: EventName.APP_LOADED }
  | { name: EventName.APP_CLOSE }
  | { name: EventName.COLLECTION_ID; value: string }
  | { name: EventName.RESULTS }

type InsurelyIframeProps = {
  configName: string
  onLoaded?: () => void
  onClose?: () => void
  onCollection?: (collectionId: string) => void
  onCompleted?: () => void
}

export const InsurelyIframe = (props: InsurelyIframeProps) => {
  const { onLoaded, onClose, onCollection, onCompleted } = props
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent<InsurelyMessage>) => {
      switch (data.name) {
        case EventName.APP_LOADED:
          return onLoaded?.()

        case EventName.APP_CLOSE:
          return onClose?.()

        case EventName.COLLECTION_ID:
          return onCollection?.(data.value)

        case EventName.RESULTS:
          return onCompleted?.()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onLoaded, onClose, onCollection, onCompleted])

  const { language } = useCurrentLocale()
  useEffect(() => {
    setInsurelyConfig({ customerId: CUSTOMER_ID, configName: props.configName, language })
  }, [language, props.configName])

  return (
    <>
      <StyledIframe
        id="insurely-data-aggregation"
        title="insurely-data-aggregation"
        src={IFRAME_URL}
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
}

export const setInsurelyConfig = (config: InsurelyConfig) => {
  window.insurely = {
    config: {
      ...window.insurely?.config,
      ...(config.customerId && { customerId: config.customerId }),
      ...(config.configName && { configName: config.configName }),
      ...(config.language && { language: config.language }),

      showCloseButton: true,
      dataAggregation: {
        hideResultsView: true,
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

const StyledIframe = styled.iframe({ border: 0 })
