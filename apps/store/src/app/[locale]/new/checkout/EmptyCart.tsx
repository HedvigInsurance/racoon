'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { Text, InfoIcon, yStack, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Pillow } from '@/components/Pillow/Pillow'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { layout } from './CheckoutPage.css'
import { productsGrid, productGridItem, emptyCart } from './EmptyCart.css'

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
    <main className={layout}>
      <div className={clsx(emptyCart, yStack({ alignItems: 'center', gap: 'lg' }))}>
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
            <div className={productGridItem}>
              <Pillow {...product.pillowImage} size="medium" />
              <div>
                <Text>{product.displayName}</Text>
                <Text color="textSecondary">{product.tagline}</Text>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
