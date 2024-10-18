import clsx from 'clsx'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { ChevronIcon } from 'ui/src/icons/Chevron'
import { Badge, Card, theme, xStack, yStack } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useBundleDiscounts } from '../../hooks/useBundleDiscounts'
import { bundleProductLink, bundleProductlinkAside } from './BundleDiscountProductLinks.css'

const arrowIconStyle = { transform: 'rotate(-90deg)' }

type Props = {
  variant?: ComponentProps<typeof Card.Root>['variant']
  size?: ComponentProps<typeof Card.Root>['size']
}

export function BundleDiscountProductLinks({ variant, size }: Props) {
  const { t } = useTranslation()
  const { productLinks } = useBundleDiscounts()

  if (productLinks.length === 0) return null

  return (
    <div className={yStack({ gap: 'sm' })}>
      {productLinks.map(({ pillowImage, title, subtitle, url }) => (
        <Link key={url} href={url}>
          <Card.Root
            variant={variant}
            size={size}
            className={clsx(variant && bundleProductLink[variant])}
          >
            <Card.Aside className={bundleProductlinkAside}>
              <div className={xStack({ gap: 'sm', alignItems: 'center' })}>
                <Badge color="signalGreenFill" size="xsmall">
                  {t('BUNDLE_DISCOUNT_QUICK_LINKS_LABEL', { ns: 'cart' })}
                </Badge>
                <ChevronIcon size={theme.fontSizes.xs} style={arrowIconStyle} />
              </div>
            </Card.Aside>

            <Card.Header className={xStack({ alignItems: 'center' })}>
              <Card.Media>
                <Pillow size="small" src={pillowImage.src} />
              </Card.Media>

              <Card.Heading>
                <Card.Title variant={{ _: 'standard.16', sm: 'standard.18' }}>{title}</Card.Title>
                <Card.Subtitle size={{ _: 'body', sm: 'md' }}>{subtitle}</Card.Subtitle>
              </Card.Heading>
            </Card.Header>
          </Card.Root>
        </Link>
      ))}
    </div>
  )
}
