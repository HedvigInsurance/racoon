import styled from '@emotion/styled'
import { useEffect, type ReactEventHandler } from 'react'
import { theme } from 'ui'

const SUCCESS_SUFFIX = '/success'
const FAIL_SUFFIX = '/fail'

type Props = {
  url: string
  onSuccess: () => void
  onFail: () => void
}

export const TrustlyIframe = ({ url, onSuccess, onFail }: Props) => {
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

  const handleLoad: ReactEventHandler<HTMLIFrameElement> = (event) => {
    const pathname = event.currentTarget.contentWindow?.location.pathname
    if (pathname?.endsWith(SUCCESS_SUFFIX)) {
      onSuccess()
    } else if (pathname?.endsWith(FAIL_SUFFIX)) {
      onFail()
    }
  }

  return <Iframe src={url} onLoad={handleLoad} />
}

const Iframe = styled.iframe({
  display: 'block',

  width: '100%',
  maxWidth: 600,

  minHeight: 500,
  height: '60vh',
  maxHeight: 800,

  border: 'none',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  marginInline: 'auto',
  backgroundColor: theme.colors.white,
})
