import { useRouter } from 'next/router'
import { Button, Space } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'
import { DebugResumeSessionSection } from './DebugResumeSessionSection'

export const DebugShopSessionSection = () => {
  const { shopSession } = useShopSession()
  const locale = useRoutingLocale()
  const router = useRouter()

  if (!shopSession) return null

  const nextUrl = `/${locale}${router.asPath}`

  return (
    <Space y={0.25}>
      <CopyToClipboard label="Shop Session">{shopSession.id}</CopyToClipboard>

      <Button variant="secondary" href={PageLink.apiSessionReset({ next: nextUrl }).href}>
        Reset Shop Session
      </Button>

      <DebugResumeSessionSection />
    </Space>
  )
}
