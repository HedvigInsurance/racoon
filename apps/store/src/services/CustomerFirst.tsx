import { Global } from '@emotion/react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'

const OPEN_ATOM = atom(false)

export const CustomerFirstLauncher = () => {
  const isDesktop = useBreakpoint('lg')
  const open = useAtomValue(OPEN_ATOM)
  const { chatWidgetSrc } = useCurrentLocale()

  if (!chatWidgetSrc) return null

  const showLauncher = isDesktop || open

  return <Global styles={{ '#chat-iframe': { display: showLauncher ? 'initial' : 'none' } }} />
}

export const useCustomerFirst = () => {
  const setOpen = useSetAtom(OPEN_ATOM)
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

  return { show } as const
}

enum MessageData {
  ShowWidget = 'showWidget',
  HideWidget = 'hideWidget',
}
