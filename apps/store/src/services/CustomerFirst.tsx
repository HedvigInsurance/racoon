import { Global } from '@emotion/react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import Script from 'next/script'
import { useCallback, useEffect } from 'react'
import { useBreakpoint } from 'ui'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

const OPEN_ATOM = atom(false)

export const CustomerFirstScript = () => {
  const isDesktop = useBreakpoint('lg')
  const open = useAtomValue(OPEN_ATOM)
  const { chatWidgetSrc } = useCurrentLocale()

  if (!chatWidgetSrc) return null

  const showLauncher = isDesktop || open
  return (
    <>
      <Global styles={{ '#chat-iframe': { display: showLauncher ? 'initial' : 'none' } }} />
      <Script strategy="afterInteractive" src={chatWidgetSrc} />
    </>
  )
}

export const useCustomerFirst = () => {
  const setOpen = useSetAtom(OPEN_ATOM)
  const { chatWidgetSrc } = useCurrentLocale()

  useEffect(() => {
    if (!chatWidgetSrc) return

    const iframeOrigin = new URL(chatWidgetSrc).origin
    const handleMessage = ({ data, origin }: MessageEvent<MessageData | unknown>) => {
      if (origin === iframeOrigin) {
        if (data === 'showWidget') setOpen(true)
        else if (data === 'hideWidget') setOpen(false)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setOpen, chatWidgetSrc])

  const show = useCallback(() => {
    setOpen(true)
    window.customerFirstAPI?.openWidget()
  }, [setOpen])

  return { show } as const
}

type MessageData = 'showWidget' | 'hideWidget'
