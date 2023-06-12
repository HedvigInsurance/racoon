import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, type ReactEventHandler, useState } from 'react'
import { theme } from 'ui'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

type Props = {
  url: string
  onSuccess: () => void
  onFail: () => void
}

export const TrustlyIframe = ({ url, onSuccess, onFail }: Props) => {
  const { routingLocale } = useCurrentLocale()

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const trustlyOrigin = new URL(url).origin
      if (event.origin !== trustlyOrigin) return

      const message = JSON.parse(event.data)
      if (message.method === 'OPEN_APP') {
        window.location.assign(message.appURL)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [url])

  const [loading, setLoading] = useState(true)
  const handleLoad: ReactEventHandler<HTMLIFrameElement> = (event) => {
    try {
      const url = event.currentTarget.contentWindow?.location.href
      if (url === PageLink.paymentSuccess({ locale: routingLocale })) {
        onSuccess()
      } else if (url === PageLink.paymentFailure({ locale: routingLocale })) {
        onFail()
      }
    } catch (error) {
      // This is a cross-origin error, which is expected
      console.debug('Unable to read iframe location', error)
    }

    setLoading(false)
  }

  return <Iframe src={url} onLoad={handleLoad} data-loading={loading} />
}

export const trustlyIframeStyles = css({
  width: '100%',
  maxWidth: 600,

  minHeight: 500,
  height: '60vh',
  maxHeight: 800,

  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  marginInline: 'auto',
  backgroundColor: theme.colors.white,
})

const pulseAnimation = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
})

const Iframe = styled.iframe(trustlyIframeStyles, {
  display: 'block',
  border: 'none',

  '&[data-loading=true]': {
    backgroundColor: theme.colors.gray200,
    animation: `${pulseAnimation} 2s infinite`,
  },
})
