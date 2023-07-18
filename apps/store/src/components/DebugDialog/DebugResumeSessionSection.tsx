import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { Button, theme } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

const INPUT_NAME = 'shopSessionId'

export const DebugResumeSessionSection = () => {
  const { routingLocale } = useCurrentLocale()
  const { shopSession } = useShopSession()
  const router = useRouter()

  if (!shopSession) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const shopSessionId = formData.get(INPUT_NAME)

    if (typeof shopSessionId !== 'string') return

    router.push(
      PageLink.session({
        shopSessionId,
        locale: routingLocale,
        next: `/${routingLocale}${router.pathname}`,
      }),
    )
  }

  return (
    <Layout onSubmit={handleSubmit}>
      <div style={{ flex: 1 }}>
        <TextField name={INPUT_NAME} label="Resume shop session" variant="small" />
      </div>

      <Button size="medium" type="submit">
        Go
      </Button>
    </Layout>
  )
}

const Layout = styled.form({
  display: 'grid',
  gridTemplateColumns: '4fr 1fr',
  alignItems: 'center',
  gap: theme.space.xs,
})
