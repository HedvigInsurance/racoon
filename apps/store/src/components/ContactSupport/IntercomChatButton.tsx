import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useIntercom } from 'react-use-intercom'
import { Flags } from '@/services/Flags/Flags'

const IntercomProvider = dynamic(() =>
  import('react-use-intercom').then((mod) => mod.IntercomProvider),
)

const INTERCOM_ENABLED = Flags.getFeature('INTERCOM')

type Props = {
  children: React.ReactNode
}

const WithIntercom = ({ children }: Props) => {
  const { show, hide, isOpen } = useIntercom()

  useEffect(() => {
    show()
    return () => {
      hide()
    }
  }, [])

  return <div onClick={isOpen ? hide : show}>{children}</div>
}

export const IntercomChatButton = ({ children }: Props) => {
  const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!appId) {
      datadogLogs.logger.warn('Expected env variable INTERCOM_APP_ID to be defined')
    }
  }, [appId])

  const withoutIntercom = <>{children}</>

  if (!appId) return withoutIntercom

  if (!INTERCOM_ENABLED) return withoutIntercom

  return (
    <IntercomButton onClick={() => setIsLoaded(true)}>
      {isLoaded ? (
        <IntercomProvider appId={appId} autoBoot autoBootProps={{ hideDefaultLauncher: true }}>
          <WithIntercom>{children}</WithIntercom>
        </IntercomProvider>
      ) : (
        children
      )}
    </IntercomButton>
  )
}

const IntercomButton = styled.button({
  cursor: 'pointer',
})
