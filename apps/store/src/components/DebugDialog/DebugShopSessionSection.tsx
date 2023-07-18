import { useRouter } from 'next/router'
import { Button, Space } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'
import { DebugResumeSessionSection } from './DebugResumeSessionSection'

export const DebugShopSessionSection = () => {
  const { shopSession } = useShopSession()
  const router = useRouter()

  if (!shopSession) return null

  const nextUrl = `/${router.locale}${router.pathname}`

  return (
    <Space y={0.25}>
      <CopyToClipboard label="Shop Session">{shopSession.id}</CopyToClipboard>

      <Button variant="secondary" href={PageLink.apiSessionReset({ next: nextUrl })}>
        Reset Shop Session
      </Button>

      <DebugResumeSessionSection />
    </Space>
  )
}
