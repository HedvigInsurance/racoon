import { usePathname } from 'next/navigation'
import { Button, Space } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'
import { DebugResumeSessionSection } from './DebugResumeSessionSection'

export const DebugShopSessionSection = () => {
  const { shopSession } = useShopSession()
  const pathname = usePathname()

  if (!shopSession || !pathname) return null

  return (
    <Space y={0.25}>
      <CopyToClipboard label="Shop Session">{shopSession.id}</CopyToClipboard>

      <Button
        as="a"
        variant="secondary"
        href={PageLink.apiSessionReset({ next: pathname }).href}
        fullWidth={true}
      >
        Reset Shop Session
      </Button>

      <DebugResumeSessionSection />
    </Space>
  )
}
