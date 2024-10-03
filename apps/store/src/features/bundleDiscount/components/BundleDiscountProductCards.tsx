import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Badge, Button, Card, grid, xStack, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { BUNDLE_DISCOUNT_PERCENTAGE } from '../bundleDiscount.constants'
import { useBundleDiscounts } from '../hooks/useBundleDiscounts'

export function BundleDiscountProductCards() {
  const { t } = useTranslation('common')

  const { productLinks } = useBundleDiscounts()

  if (productLinks.length === 0) return null

  return (
    <div className={yStack({ gap: 'sm' })}>
      {productLinks.map(({ pillowImage, title, subtitle, url, priceCalculatorURL }) => (
        <Card.Root key={url}>
          <Card.Aside>
            <div className={xStack({ gap: 'sm', alignItems: 'center' })}>
              <Badge color="signalGreenFill" size="small">
                {BUNDLE_DISCOUNT_PERCENTAGE}
              </Badge>
            </div>
          </Card.Aside>
          <Card.Header>
            <Card.Media>
              <Pillow size="small" src={pillowImage.src} />
            </Card.Media>
            <Card.Heading>
              <Card.Title>{title}</Card.Title>
              <Card.Subtitle>{subtitle}</Card.Subtitle>
            </Card.Heading>
          </Card.Header>

          <div {...grid({ columns: priceCalculatorURL ? 2 : 1, gap: 'xs' })}>
            <Button as={Link} href={url} variant="secondary" size="medium">
              {t('READ_MORE')}
            </Button>

            {priceCalculatorURL ? (
              <Button as={Link} href={priceCalculatorURL} variant="primary" size="medium">
                {t('SEE_PRICE')}
              </Button>
            ) : null}
          </div>
        </Card.Root>
      ))}
    </div>
  )
}
