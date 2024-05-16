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

export function BundleDiscountExtraProductLinks() {
  const { t } = useTranslation('cart')
  const extraProductLinks = useBundleDiscountExtraProductLinks()
  if (extraProductLinks.length === 0) return null
  return (
    <div>
      <Text>{t('BUNDLE_DISCOUNT_QUICK_LINKS_TITLE')}</Text>
      <Text color="textSecondary">
        {t('BUNDLE_DISCOUNT_QUICK_LINKS_SUBTITLE', { percentage: BUNDLE_DISCOUNT_PERCENTAGE })}
      </Text>
      {extraProductLinks.map((item) => (
        <Link key={item.url} href={item.url}>
          <Card>
            <Pillow size="small" src={item.pillowImage.src}></Pillow>
            <div className={sprinkles({ flexGrow: 1 })}>
              <Text>{item.title}</Text>
              <Text color="textSecondaryOnGray">{item.subtitle}</Text>
            </div>
            <Badge color="signalGreenFill" size="small">
              {t('BUNDLE_DISCOUNT_QUICK_LINKS_LABEL')}
            </Badge>
            <ChevronIcon size={theme.fontSizes.sm} style={arrowIconStyle} />
          </Card>
        </Link>
      ))}
    </div>
  )
}

// TODO: Fix reusable Card component, it's not used and broken
function Card({ children }: { children: ReactNode }) {
  return <div className={bundleDiscountLinkCard}>{children}</div>
}
