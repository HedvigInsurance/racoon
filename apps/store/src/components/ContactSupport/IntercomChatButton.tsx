import { datadogLogs } from '@datadog/browser-logs'
import { useEffect } from 'react'
import { IntercomProvider, useIntercom } from 'react-use-intercom'
import { Button } from 'ui'

const WithIntercom = () => {
  const { show } = useIntercom()

  return (
    <Button variant="ghost" onClick={show}>
      Chat with us
    </Button>
  )
}

export const IntercomChatButton = () => {
  const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID

  useEffect(() => {
    if (!appId) {
      datadogLogs.logger.warn('Expected env variable INTERCOM_APP_ID to be defined')
    }
  }, [appId])

  if (!appId) {
    return (
      <Button variant="ghost" disabled>
        Chat with us
      </Button>
    )
  }

  return (
    <IntercomProvider
      appId={appId}
      autoBoot
      autoBootProps={{ hideDefaultLauncher: true }}
      initializeDelay={1000}
    >
      <WithIntercom />
    </IntercomProvider>
  )
}
