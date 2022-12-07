// Documentation: https://docs.insurely.com/autofill-and-switcher

import styled from '@emotion/styled'
import Script from 'next/script'
import { useEffect } from 'react'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const IFRAME_URL = 'https://dc.insurely.com/v2/'
const BOOTSTRAP_SCRIPT_URL = 'https://dc.insurely.com/v2/assets/js/dc-bootstrap.js'

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

type InsurelyIframeProps = BoostrapScriptProps & {
  clientId: string
  onLoaded?: () => void
  onClose?: () => void
  onCollection?: (collectionId: string) => void
  onCompleted?: () => void
}

export const InsurelyIframe = (props: InsurelyIframeProps) => {
  const { clientId, onLoaded, onClose, onCollection, onCompleted, ...bootstrapProps } = props

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

  return (
    <>
      <StyledIframe
        title="Insurely"
        src={`${IFRAME_URL}?clientId=${clientId}`}
        sandbox="allow-scripts
    allow-same-origin
    allow-popups
    allow-forms
    allow-popups-to-escape-sandbox
    allow-top-navigation"
      />

      <BoostrapScript {...bootstrapProps} />
    </>
  )
}

type BoostrapScriptProps = Partial<{
  personalNumber: string
  company: string
}>

const BoostrapScript = ({ personalNumber, company }: BoostrapScriptProps) => {
  const { language } = useCurrentLocale()

  const handleLoad = () => {
    window.setClientParams?.({
      fontType: 'secondary',
      hideResultsView: true,
      language,
      prefilledInput: {
        ...(personalNumber && { SWEDISH_PERSONAL_NUMBER: personalNumber }),
        ...(company && { company }),
      },
    })
  }

  return <Script strategy="afterInteractive" src={BOOTSTRAP_SCRIPT_URL} onLoad={handleLoad} />
}

const StyledIframe = styled.iframe({
  border: 0,
})
