import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { Badge, Card } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { type OfferRecommendation } from './hooks/useRecommendations'

type RootProps = ComponentProps<typeof Card.Root>
const CrossSellRoot = ({ children, ...props }: RootProps) => {
  const { t } = useTranslation('cart')

  const { shopSession } = useShopSession()

  if (!shopSession) {
    return null
  }

  return (
    <Card.Root {...props}>
      <Card.Aside>
        <Badge color="pinkFill1">{t('QUICK_ADD_BADGE_LABEL')}</Badge>
      </Card.Aside>

      {children}
    </Card.Root>
  )
}

type HeaderProps = ComponentProps<typeof Card.Header> & {
  product: OfferRecommendation['product']
}
const CrossSellHeader = ({ product, ...props }: HeaderProps) => {
  const { t } = useTranslation('cart')

  return (
    <Card.Header {...props}>
      <Card.Media>
        <Pillow size="small" {...product.pillowImage} />
      </Card.Media>
      <Card.Heading>
        <Card.Title>
          <Link href={product.pageLink}>{product.displayNameFull}</Link>
        </Card.Title>
        <Card.Subtitle size={{ _: 'body', sm: 'md' }}>{t('CROSS_SELL_SUBTITLE')}</Card.Subtitle>
      </Card.Heading>
    </Card.Header>
  )
}

export const CrossSell = {
  Root: CrossSellRoot,
  Header: CrossSellHeader,
}
