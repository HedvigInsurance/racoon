import { headers } from 'next/headers'
import { Button, Space } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { MessageLogger } from './components/MessageLogger/MessageLogger'
import { iframe, sidebar, wrapper } from './iframeDebugger.css'

type Props = {
  searchParams: {
    url?: string
  }
}

function IFrameDebuggerPage({ searchParams }: Props) {
  const { url } = getDebugURL(searchParams.url)

  if (!url) {
    // What exactly do we expect to happen when the feature is disabled?
    return <h1>Feature disabled</h1>
  }

  return (
    <div className={wrapper}>
      <iframe
        className={iframe}
        src={url}
        sandbox="allow-scripts allow-same-origin allow-popups
    allow-forms allow-popups-to-escape-sandbox allow-top-navigation"
      />

      <div className={sidebar}>
        <form method="GET">
          <Space y={0.25}>
            <TextField name="url" label="Iframe URL" defaultValue={url} />
            <Button type="submit" variant="primary-alt" fullWidth={true}>
              Reload
            </Button>
          </Space>
        </form>

        <MessageLogger />
      </div>
    </div>
  )
}

const getDebugURL = (url?: string) => {
  const headersList = headers()

  const referer = headersList.get('referer')

  let origin = 'http://localhost:8040'

  if (typeof referer === 'string') {
    const refererURL = new URL(referer)
    origin = refererURL.origin
  }

  const debugURL = url || `${origin}/se/widget/flows/avy-offer`

  if (process.env.FEATURE_DEBUGGER !== 'true') {
    return {
      url: null,
    }
  }

  return {
    url: debugURL,
  }
}

export default IFrameDebuggerPage
