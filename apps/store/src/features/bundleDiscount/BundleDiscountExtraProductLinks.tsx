import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Badge, ChevronIcon, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { BUNDLE_DISCOUNT_PERCENTAGE } from '@/features/bundleDiscount/bundleDiscount'
import { useBundleDiscountExtraProductLinks } from '@/features/bundleDiscount/useBundleDiscountExtraProductLinks'
import { bundleDiscountLinkCard } from './BundleDiscountExtraProductLinks.css'

const arrowIconStyle = { transform: 'rotate(-90deg)' }

type Props = {
  children?: ReactNode
}

export function BundleDiscountExtraProductLinks({ children }: Props) {
  const { t } = useTranslation('cart')
  const extraProductLinks = useBundleDiscountExtraProductLinks()
  if (extraProductLinks.length === 0) return null
  return (
    <>
      {typeof children === 'undefined' ? (
        <BundleDiscountExtraProductLinksDefaultHeader />
      ) : (
        children
      )}
      {extraProductLinks.map((item) => (
        <Link key={item.url} href={item.url} className={bundleDiscountLinkCard}>
          <Pillow size="small" src={item.pillowImage.src}></Pillow>
          <div className={sprinkles({ flexGrow: 1 })}>
            <Text>{item.title}</Text>
            <Text color="textSecondaryOnGray">{item.subtitle}</Text>
          </div>
          <Badge color="signalGreenFill" size="small">
            {t('BUNDLE_DISCOUNT_QUICK_LINKS_LABEL')}
          </Badge>
          <ChevronIcon size={theme.fontSizes.sm} style={arrowIconStyle} />
        </Link>
      ))}
    </>
  )
}

function BundleDiscountExtraProductLinksDefaultHeader() {
  const { t } = useTranslation('cart')
  return (
    <Text>
      <Text>{t('BUNDLE_DISCOUNT_QUICK_LINKS_TITLE')}</Text>
      <Text color="textSecondary">
        {t('BUNDLE_DISCOUNT_QUICK_LINKS_SUBTITLE', {
          percentage: BUNDLE_DISCOUNT_PERCENTAGE,
        })}
      </Text>
    </Text>
  )
}
