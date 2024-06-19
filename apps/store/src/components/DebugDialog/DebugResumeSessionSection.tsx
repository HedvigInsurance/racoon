import styled from '@emotion/styled'
import { usePathname } from 'next/navigation'
import { Button, theme } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

const INPUT_NAME = 'shopSessionId'

export function DebugResumeSessionSection() {
  const { shopSession } = useShopSession()
  const pathname = usePathname()
  const locale = useRoutingLocale()

  if (!shopSession) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const shopSessionId = formData.get(INPUT_NAME)

    if (typeof shopSessionId !== 'string') return

    const redirect = PageLink.session({ locale, shopSessionId, next: pathname! })
    // We want hard navigation to work reliably in both pages and app routers
    window.location.replace(redirect.toString())
  }

  return (
    <Layout onSubmit={handleSubmit}>
      <div style={{ flex: 1 }}>
        <TextField name={INPUT_NAME} label="Resume shop session" variant="small" />
      </div>

      <Button variant="secondary" size="medium" type="submit" fullWidth={true}>
        Go
      </Button>
    </Layout>
  )
}

const Layout = styled.form({
  display: 'grid',
  gridTemplateColumns: '4fr minmax(8rem, 1fr)',
  alignItems: 'center',
  gap: theme.space.xxs,
})
