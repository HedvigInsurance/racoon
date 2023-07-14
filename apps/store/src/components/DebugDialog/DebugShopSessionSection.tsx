import { Space, Text } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { CopyToClipboard } from './CopyToClipboard'

export const DebugShopSessionSection = () => {
  const { shopSession } = useShopSession()

  if (!shopSession) return null

  return (
    <Space y={0.25}>
      <Text as="p" size="sm">
        Shop Session
      </Text>
      <CopyToClipboard>{shopSession.id}</CopyToClipboard>
    </Space>
  )
}
