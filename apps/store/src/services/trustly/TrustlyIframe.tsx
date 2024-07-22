import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { type ComponentPropsWithoutRef, type ReactEventHandler, useEffect, useState } from 'react'
import { theme } from 'ui'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

type Props = Omit<ComponentPropsWithoutRef<'iframe'>, 'src'> & {
  url: string
  onSuccess: () => void
  onFail: () => void
}

export const TrustlyIframe = ({ url, onSuccess, onFail, ...others }: Props) => {
  const locale = useRoutingLocale()

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
      if (url === PageLink.paymentSuccess({ locale }).href) {
        onSuccess()
      } else if (url === PageLink.paymentFailure({ locale }).href) {
        onFail()
      }
    } catch (error) {
      // This is a cross-origin error, which is expected
      console.debug('Unable to read iframe location', error)
    }

    setLoading(false)
  }

  return <Iframe src={url} onLoad={handleLoad} data-loading={loading} {...others} />
}

export const TRUSTLY_IFRAME_MAX_WIDTH = 600
const TRUSTLY_IFRAME_MIN_HEIGHT = 500
export const TRUSTLY_IFRAME_MAX_HEIGHT = 800

export const trustlyIframeStyles = css({
  width: '100%',
  maxWidth: TRUSTLY_IFRAME_MAX_WIDTH,

  minHeight: TRUSTLY_IFRAME_MIN_HEIGHT,
  height: '100%',
  maxHeight: TRUSTLY_IFRAME_MAX_HEIGHT,

  borderRadius: 16,
  boxShadow: theme.shadow.default,
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
    animation: `${pulseAnimation} 2s`,
    animationIterationCount: 3,
  },
})
