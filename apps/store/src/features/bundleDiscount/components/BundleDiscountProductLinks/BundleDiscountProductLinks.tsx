import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Badge, Card, ChevronIcon, theme, xStack, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useBundleDiscountProductLinks } from '@/features/bundleDiscount/hooks/useBundleDiscountProductLinks'
import { bundleProductLink, bundleProductlinkAside } from './BundleDiscountProductLinks.css'

const arrowIconStyle = { transform: 'rotate(-90deg)' }

export function BundleDiscountProductLinks() {
  const { t } = useTranslation('cart')

  const productLinks = useBundleDiscountProductLinks()

  if (productLinks.length === 0) return null

  return (
    <div className={yStack({ gap: 'sm' })}>
      {productLinks.map((productLink) => (
        <Link key={productLink.url} href={productLink.url}>
          <Card.Root size="md" variant="secondary" className={bundleProductLink}>
            <Card.Aside className={bundleProductlinkAside}>
              <div className={xStack({ gap: 'sm', alignItems: 'center' })}>
                <Badge color="signalGreenFill" size="small">
                  {t('BUNDLE_DISCOUNT_QUICK_LINKS_LABEL')}
                </Badge>
                <ChevronIcon size={theme.fontSizes.sm} style={arrowIconStyle} />
              </div>
            </Card.Aside>
            <Card.Header>
              <Card.Media>
                <Pillow size="small" src={productLink.pillowImage.src} />
              </Card.Media>
              <Card.Heading>
                <Card.Title>{productLink.title}</Card.Title>
                <Card.Subtitle>{productLink.subtitle}</Card.Subtitle>
              </Card.Heading>
            </Card.Header>
          </Card.Root>
        </Link>
      ))}
    </div>
  )
}
