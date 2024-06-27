import { usePathname } from 'next/navigation'
import { Button, Space } from 'ui'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'
import { DebugResumeSessionSection } from './DebugResumeSessionSection'

export const DebugShopSessionSection = () => {
  const shopSessionId = useShopSessionId()
  const pathname = usePathname()

  if (!shopSessionId || !pathname) return null

  return (
    <Space y={0.25}>
      <CopyToClipboard label="Shop Session">{shopSessionId}</CopyToClipboard>

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
