'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Text, InfoIcon, yStack, theme, Card } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Pillow } from '@/components/Pillow/Pillow'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { container } from '../../CheckoutPage.css'
import { productLinkCard, productsGrid } from './EmptyCart.css'

export type Product = {
  id: string
  displayName: string
  tagline: string
  pageLink: string
  pillowImage: {
    src: string
    alt?: string
  }
}

type Props = {
  locale: RoutingLocale
  products: Array<Product>
}

export function EmptyCart({ locale, products }: Props) {
  const { t } = useTranslation('cart')

  return (
    <main>
      <div className={clsx(container, yStack({ alignItems: 'center', gap: 'lg' }))}>
        <div className={yStack({ alignItems: 'center', gap: 'md' })}>
          <InfoIcon size="2.5rem" color={theme.colors.signalBlueElement} />
          <Text>{t('CART_EMPTY_SUMMARY')}</Text>
        </div>

        <ButtonNextLink href={PageLink.store({ locale })} size="medium">
          {t('GO_TO_STORE')}
        </ButtonNextLink>
      </div>

      <div className={productsGrid}>
        {products.map((product) => (
          <Link key={product.id} href={product.pageLink}>
            <Card.Root size="md" variant="ghost" className={productLinkCard}>
              <Card.Header>
                <Card.Media>
                  <Pillow {...product.pillowImage} size="medium" />
                </Card.Media>
                <Card.Heading>
                  <Card.Title>{product.displayName}</Card.Title>
                  <Card.Subtitle>{product.tagline}</Card.Subtitle>
                </Card.Heading>
              </Card.Header>
            </Card.Root>
          </Link>
        ))}
      </div>
    </main>
  )
}
