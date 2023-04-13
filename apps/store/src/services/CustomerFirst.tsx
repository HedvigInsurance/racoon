import { Global } from '@emotion/react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import Script from 'next/script'
import { useCallback, useEffect } from 'react'
import { useBreakpoint } from 'ui'

const SCRIPT_SRC = process.env.NEXT_PUBLIC_CUSTOMER_FIRST_SCRIPT as string | undefined

const OPEN_ATOM = atom(false)

export const CustomerFirstScript = () => {
  const isDesktop = useBreakpoint('lg')
  const open = useAtomValue(OPEN_ATOM)

  if (!SCRIPT_SRC) return null

  const showLauncher = isDesktop || open
  return (
    <>
      <Global styles={{ '#chat-iframe': { display: showLauncher ? 'initial' : 'none' } }} />
      <Script strategy="afterInteractive" src={SCRIPT_SRC} />
    </>
  )
}

export const useCustomerFirst = () => {
  const setOpen = useSetAtom(OPEN_ATOM)

  useEffect(() => {
    if (!SCRIPT_SRC) return

    const iframeOrigin = new URL(SCRIPT_SRC).origin
    const handleMessage = ({ data, origin }: MessageEvent<MessageData>) => {
      if (origin === iframeOrigin) {
        if (data === 'showWidget') setOpen(true)
        else if (data === 'hideWidget') setOpen(false)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setOpen])

  const show = useCallback(() => {
    setOpen(true)
    window.customerFirstAPI?.openWidget()
  }, [setOpen])

  return { show } as const
}

type MessageData = 'showWidget' | 'hideWidget'
