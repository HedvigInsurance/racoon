import { Global } from '@emotion/react'
import { atom, useAtom } from 'jotai'
import Script from 'next/script'
import { useCallback, useEffect } from 'react'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'

const OPEN_ATOM = atom(false)

type Props = {
  hideChat?: boolean
}

export const CustomerFirstScript = ({ hideChat = false }: Props) => {
  const isDesktop = useBreakpoint('lg')
  const { chatWidgetSrc } = useCurrentLocale()
  const { open } = useCustomerFirst()

  if (!chatWidgetSrc) return null

  const showLauncher = hideChat ? open : isDesktop || open
  return (
    <>
      <Global styles={{ '#chat-iframe': { display: showLauncher ? 'initial' : 'none' } }} />
      <Script strategy="afterInteractive" src={chatWidgetSrc} />
    </>
  )
}

export const useCustomerFirst = () => {
  const [open, setOpen] = useAtom(OPEN_ATOM)
  const { chatWidgetSrc } = useCurrentLocale()

  useEffect(() => {
    if (!chatWidgetSrc) return

    const iframeOrigin = new URL(chatWidgetSrc).origin
    const handleMessage = ({ data, origin }: MessageEvent<unknown>) => {
      if (origin === iframeOrigin) {
        if (data === MessageData.ShowWidget) setOpen(true)
        else if (data === MessageData.HideWidget) setOpen(false)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setOpen, chatWidgetSrc])

  const show = useCallback(() => {
    setOpen(true)
    window.customerFirstAPI?.openWidget()
  }, [setOpen])

  return { open, show } as const
}

enum MessageData {
  ShowWidget = 'showWidget',
  HideWidget = 'hideWidget',
}
