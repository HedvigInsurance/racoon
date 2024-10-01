import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { Text, Card, Divider, yStack } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Pillow } from '@/components/Pillow/Pillow'
import { TotalPrice } from '@/components/ProductCard/TotalPrice/TotalPrice'
import { useSelectedOfferValueOrThrow } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export function PurchaseSummary({ className }: { className?: string }) {
  const { t } = useTranslation('purchase-form')
  const locale = useRoutingLocale()
  const offer = useSelectedOfferValueOrThrow()

  return (
    <div className={clsx(yStack({ gap: 'xl' }), className)}>
      <Text size="xl">{t('ADDED_TO_CART_LABEL')}</Text>

      <Card.Root>
        <Card.Header>
          <Card.Media>
            <Pillow size="small" {...offer.product.pillowImage} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>{offer.product.displayNameFull}</Card.Title>
            <Card.Subtitle>{offer.exposure.displayNameShort}</Card.Subtitle>
          </Card.Heading>
        </Card.Header>
        <Divider />
        <TotalPrice label="Price" {...getOfferPrice(offer.cost)} />
      </Card.Root>

      <div className={yStack({ gap: 'xs' })}>
        <ButtonNextLink href={PageLink.checkout({ locale })} variant="primary">
          {t('GO_TO_CART_LABEL')}
        </ButtonNextLink>
        <ButtonNextLink href={PageLink.store({ locale })} variant="ghost">
          {t('SEE_MORE_INSURANCES_LABEL')}
        </ButtonNextLink>
      </div>
    </div>
  )
}
