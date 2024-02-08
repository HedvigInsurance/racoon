import { useRouter } from 'next/router'
import { Button, Space } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'
import { DebugResumeSessionSection } from './DebugResumeSessionSection'

export const DebugShopSessionSection = () => {
  const { shopSession } = useShopSession()
  const { routingLocale } = useCurrentLocale()
  const router = useRouter()

  if (!shopSession) return null

  const nextUrl = `/${routingLocale}${router.asPath}`

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
