// Documentation: https://docs.insurely.com/autofill-and-switcher

import styled from '@emotion/styled'
import Script from 'next/script'
import { useEffect, useMemo } from 'react'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const IFRAME_URL = 'https://dc.insurely.com/v2/select-authentication'
const BOOTSTRAP_SCRIPT_URL = 'https://dc.insurely.com/v2/assets/js/dc-bootstrap.js'
const PREFILL_STORE: Array<Record<string, string>> = []

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
  clientId: string
  onLoaded?: () => void
  onClose?: () => void
  onCollection?: (collectionId: string) => void
  onCompleted?: () => void
}

export const InsurelyIframe = (props: InsurelyIframeProps) => {
  const { clientId, onLoaded, onClose, onCollection, onCompleted } = props
  const { language } = useCurrentLocale()

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

  const handleLoad = () => {
    const prefilledInput = PREFILL_STORE.shift()
    window.setClientParams?.({
      fontType: 'secondary',
      hideResultsView: true,
      language,
      ...(prefilledInput && { prefilledInput }),
    })
  }

  const iFrameSrc = useMemo(() => {
    const queryParams = new URLSearchParams({ clientId })
    return `${IFRAME_URL}?${queryParams.toString()}`
  }, [clientId])

  return (
    <>
      <StyledIframe
        title="Insurely"
        src={iFrameSrc}
        sandbox="allow-scripts
    allow-same-origin
    allow-popups
    allow-forms
    allow-popups-to-escape-sandbox
    allow-top-navigation"
      />

      <Script strategy="afterInteractive" src={BOOTSTRAP_SCRIPT_URL} onLoad={handleLoad} />
    </>
  )
}

type InsurelyClientParams = Partial<{ company: string; personalNumber: string }>

export const insurelyPrefillInput = ({ personalNumber, company }: InsurelyClientParams) => {
  const prefilledInput = {
    ...(personalNumber && { SWEDISH_PERSONAL_NUMBER: personalNumber }),
    ...(company && { company }),
  }

  // If the iframe is already loaded, we can set the prefilled input directly
  if (window.setClientParams) {
    return window.setClientParams({ prefilledInput })
  }

  // Otherwise we store the prefilled input and set it when the iframe is loaded
  PREFILL_STORE.push(prefilledInput)
}

const StyledIframe = styled.iframe({ border: 0 })
