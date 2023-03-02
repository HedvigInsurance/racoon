import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { Fragment, useEffect, useState } from 'react'
import { useIntercom } from 'react-use-intercom'
import { Flags } from '@/services/Flags/Flags'

const IntercomProvider = dynamic(() =>
  import('react-use-intercom').then((mod) => mod.IntercomProvider),
)

// const ONE_SECOND = 2000

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
  }, [show])

  return <div onClick={isOpen ? hide : show}>{children}</div>
}

export const IntercomChatButton = ({ children }: Props) => {
  const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID
  const [isLoaded, setIsloaded] = useState(false)

  useEffect(() => {
    if (!appId) {
      datadogLogs.logger.warn('Expected env variable INTERCOM_APP_ID to be defined')
    }
  }, [appId])

  const withoutIntercom = <>{children}</>

  if (!appId) return withoutIntercom

  // if (!INTERCOM_ENABLED) return withoutIntercom

  return (
    <IntercomButton onClick={() => setIsloaded(true)}>
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

// styles

const IntercomButton = styled.button({
  cursor: 'pointer',
})
