import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { Button, theme } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

const INPUT_NAME = 'shopSessionId'

export const DebugResumeSessionSection = () => {
  const { shopSession } = useShopSession()
  const router = useRouter()
  const locale = useRoutingLocale()

  if (!shopSession) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const shopSessionId = formData.get(INPUT_NAME)

    if (typeof shopSessionId !== 'string') return

    const redirect = PageLink.session({ locale, shopSessionId, next: router.asPath })
    router.push(redirect)
  }

  return (
    <Layout onSubmit={handleSubmit}>
      <div style={{ flex: 1 }}>
        <TextField name={INPUT_NAME} label="Resume shop session" variant="small" />
      </div>

      <Button variant="secondary" size="medium" type="submit">
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
