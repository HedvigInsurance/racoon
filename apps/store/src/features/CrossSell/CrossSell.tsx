'use client'

import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Badge, Button, Card, grid, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { AccidentCrossSellForm } from './components/AccidentCrossSellForm'
import { type OfferRecommendation } from './hooks/useRecommendations'

type Props = {
  recommendation: OfferRecommendation
}

export function CrossSell({ recommendation }: Props) {
  const { t } = useTranslation(['cart', 'common'])

  const { shopSession } = useShopSession()

  if (!shopSession) {
    return null
  }

  const { product, offer } = recommendation

  return (
    <Card.Root>
      <Card.Aside>
        <Badge color="pinkFill1">{t('QUICK_ADD_BADGE_LABEL')}</Badge>
      </Card.Aside>
      <Card.Header>
        <Card.Media>
          <Pillow size="small" {...product.pillowImage} />
        </Card.Media>
        <Card.Heading>
          <Card.Title>{product.displayNameFull}</Card.Title>
          <Card.Subtitle>{t('USP_NO_BINDING_TIME')}</Card.Subtitle>
        </Card.Heading>
      </Card.Header>

      <AccidentCrossSellForm offer={offer}>
        {({ isCoInsuredUpdated, isPending }) => (
          <footer className={yStack({ gap: 'md' })}>
            <div {...grid({ columns: '2', gap: 'xs' })}>
              <Button as={Link} href={product.pageLink} variant="secondary" size="medium">
                {t('common:READ_MORE')}
              </Button>

              <Button type="submit" size="medium" disabled={isPending} loading={isPending}>
                {isCoInsuredUpdated ? t('QUICK_ADD_UPDATE') : t('QUICK_ADD_BUTTON')}
              </Button>
            </div>
          </footer>
        )}
      </AccidentCrossSellForm>
    </Card.Root>
  )
}
