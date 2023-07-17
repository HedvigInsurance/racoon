import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { Button, Space, Text, theme } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { PageLink } from '@/utils/PageLink'
import { CopyToClipboard } from './CopyToClipboard'

export const DebugShopSessionSection = () => {
  const { shopSession } = useShopSession()
  const router = useRouter()

  if (!shopSession) return null

  const nextUrl = `/${router.locale}${router.pathname}`

  return (
    <Layout>
      <Space y={0.25} style={{ flex: 1 }}>
        <Text as="p" size="sm">
          Shop Session
        </Text>
        <CopyToClipboard>{shopSession.id}</CopyToClipboard>
      </Space>

      <Button variant="secondary" size="medium" href={PageLink.apiSessionReset({ next: nextUrl })}>
        Reset
      </Button>
    </Layout>
  )
}

const Layout = styled.div({
  display: 'grid',
  gridTemplateColumns: '4fr 1fr',
  alignItems: 'flex-end',
  gap: theme.space.xs,
})
