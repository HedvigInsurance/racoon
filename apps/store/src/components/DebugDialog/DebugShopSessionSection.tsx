import { usePathname } from 'next/navigation'
import { Button } from 'ui/src/components/Button/Button'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'
import { DebugResumeSessionSection } from './DebugResumeSessionSection'

export const DebugShopSessionSection = () => {
  const shopSessionId = useShopSessionId()
  const pathname = usePathname()

  if (shopSessionId == null || pathname == null) return null

  return (
    <>
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
    </>
  )
}
