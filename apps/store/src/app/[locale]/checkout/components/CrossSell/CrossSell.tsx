'use client'

import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Badge, Button, Card, grid, Heading, sprinkles, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { DetailsList } from '@/components/ProductCard/DetailsList/DetailsList'
import { useBonusOffer } from '@/components/QuickAdd/useBonusOffer'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AccidentCrossSellForm } from './components/AccidentCrossSellForm'

export function CrossSell() {
  const { t } = useTranslation(['cart', 'common'])

  const offerRecommendation = useBonusOffer()

  const { shopSession } = useShopSession()

  if (!offerRecommendation || !shopSession) {
    return null
  }

  const { product, offer } = offerRecommendation

  // We only support cross-selling of Accident insurance at the moment
  if (product.name !== 'SE_ACCIDENT') {
    console.log(`Cross sell | Unsupported product: ${product.name}`)
    return null
  }

  console.log(grid({ columns: '2' }))

  return (
    <section className={yStack({ gap: 'lg' })}>
      <header>
        <Heading as="h2" variant="standard.32">
          {t('QUICK_ADD_BUNDLE_HEADER')}
        </Heading>
        <Heading as="h2" variant="standard.32" color="textSecondary">
          Save up to 20% for 12 months
        </Heading>
      </header>
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
              <DetailsList.Root size="md">
                <DetailsList.Item className={sprinkles({ color: 'textPrimary' })}>
                  <DetailsList.Label>{t('CHECKOUT_PRICE_TOTAL')}</DetailsList.Label>
                  <DetailsList.Value>
                    <Price
                      className={sprinkles({ justifyContent: 'flex-end' })}
                      {...getOfferPrice(offer.cost)}
                    />
                  </DetailsList.Value>
                </DetailsList.Item>
              </DetailsList.Root>

              <div {...grid({ columns: '2', gap: 'xs' })}>
                <Button as={Link} href="#" variant="secondary" size="medium">
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
    </section>
  )
}
