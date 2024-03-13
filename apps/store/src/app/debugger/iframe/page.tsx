import { Button, Space } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import MessageLogger from './components/MessageLogger/MessageLogger'
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
            <Button type="submit" variant="primary-alt">
              Reload
            </Button>
          </Space>
        </form>

        <MessageLogger />
      </div>
    </div>
  )
}
const DEFAULT_URL = 'http://localhost:8040/se/widget/flows/avy-offer'

const getDebugURL = (url: string = DEFAULT_URL) => {
  if (process.env.FEATURE_DEBUGGER !== 'true') {
    return {
      url: null,
    }
  }

  return {
    url,
  }
}

export default IFrameDebuggerPage
