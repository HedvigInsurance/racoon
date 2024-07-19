import { type ComponentPropsWithoutRef, type ReactEventHandler, useEffect, useState } from 'react'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { trustlyIframe } from './TrustlyIframe.css'

export { TRUSTLY_IFRAME_MAX_WIDTH, TRUSTLY_IFRAME_MAX_HEIGHT } from './TrustlyIframe.css'

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

  return (
    <iframe
      className={trustlyIframe}
      src={url}
      onLoad={handleLoad}
      data-loading={loading}
      {...others}
    />
  )
}
