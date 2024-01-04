import styled from '@emotion/styled'
import { type GetServerSidePropsContext, type GetServerSidePropsResult } from 'next'
import { useEffect, useState } from 'react'
import { Space, Text, theme, Button } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { isWidgetEvent, type WidgetEvent } from '@/features/widget/publishWidgetEvent'

type Props = {
  url: string
}

const Page = (props: Props) => {
  return (
    <Wrapper>
      <Iframe
        src={props.url}
        sandbox="allow-scripts allow-same-origin allow-popups
    allow-forms allow-popups-to-escape-sandbox allow-top-navigation"
      />

      <Sidebar>
        <form method="GET">
          <Space y={0.25}>
            <TextField name="url" label="Iframe URL" defaultValue={props.url} />
            <Button type="submit" variant="primary-alt">
              Reload
            </Button>
          </Space>
        </form>

        <MessageLogger />
      </Sidebar>
    </Wrapper>
  )
}

const DEFAULT_URL = 'http://localhost:8040/se/widget/flows/avy-offer'

export const getServerSideProps = (
  context: GetServerSidePropsContext,
): GetServerSidePropsResult<Props> => {
  if (process.env.FEATURE_DEBUGGER !== 'true') {
    return {
      notFound: true,
    }
  }

  const queryUrl = context.query['url']
  const url = typeof queryUrl === 'string' ? queryUrl : DEFAULT_URL

  return {
    props: { url },
  }
}

const MessageLogger = () => {
  const [messages, setMessages] = useState<Array<WidgetEvent>>([])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (isWidgetEvent(event)) {
        setMessages((prev) => [...prev, event.data])
      }
    }

    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  return (
    <MessageLoggerWrapper>
      {messages.map((message, index) => (
        <MessageLog key={index}>
          <Text as="span" size="sm">
            {JSON.stringify(message, null, 2)}
          </Text>
        </MessageLog>
      ))}
    </MessageLoggerWrapper>
  )
}

const Wrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: theme.space.xl,
  height: '100dvh',
  padding: theme.space.xl,
})

const Iframe = styled.iframe({
  height: '100%',
  maxHeight: 750,
  width: 375,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.borderOpaque1,
  display: 'block',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
})

const Sidebar = styled.div({
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gap: theme.space.xl,
})

const MessageLoggerWrapper = styled.ul({
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.colors.borderOpaque1,
  overflowY: 'auto',
})

const MessageLog = styled.li({
  padding: theme.space.xs,
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: theme.colors.borderOpaque1,
})

export default Page
