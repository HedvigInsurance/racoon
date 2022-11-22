import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useEffect } from 'react'
import { IntercomProvider, useIntercom } from 'react-use-intercom'
import { Button, ButtonProps } from 'ui'

const ChatButton = (props: ButtonProps) => {
  return (
    <FlexButton variant="outlined" {...props}>
      Chat with us
    </FlexButton>
  )
}

const WithIntercom = () => {
  const { show } = useIntercom()

  return <ChatButton onClick={show} />
}

export const IntercomChatButton = () => {
  const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID

  useEffect(() => {
    if (!appId) {
      datadogLogs.logger.warn('Expected env variable INTERCOM_APP_ID to be defined')
    }
  }, [appId])

  if (!appId) {
    return <ChatButton disabled />
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

const FlexButton = styled(Button)({ flex: 1 })
