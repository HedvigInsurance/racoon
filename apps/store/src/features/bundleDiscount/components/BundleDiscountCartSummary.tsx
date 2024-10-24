import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { readMoreLink } from '@/features/bundleDiscount/components/BundleDiscountSummary/BundleDiscountSummary.css'
import type { CartFragment } from '@/services/graphql/generated'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { BundleDiscountSummary } from './BundleDiscountSummary/BundleDiscountSummary'

type Props = {
  cart: CartFragment
}

export function BundleDiscountCartSummary({ cart }: Props) {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')
  const locale = useRoutingLocale()
  const { cost, redeemedCampaign, entries } = cart

  if (redeemedCampaign == null) {
    console.error('cart.redeemedCampaign must be present')
    return null
  }

  let content: ReactNode
  const percentage = redeemedCampaign.discount.percentage + '%'
  const startDates = new Set(entries.map((entry) => entry.startDate as string))
  // Make sure we don't overpromise on total amount saved - it's only valid if all entries start on the same day
  // Discount code covers 12mo from the first startDate and the less overlap there is between active period
  // the less are total savings
  if (startDates.size === 1) {
    const totalSaved = formatter.money({
      amount: cost.discount.amount * redeemedCampaign.discount.months,
      currencyCode: cost.net.currencyCode,
    })
    content = t('BUNDLE_DISCOUNT_SUMMARY', {
      percentage,
      totalSaved,
    })
  } else {
    // Safe to sort as strings, since API dates use ISO8601 format
    // GOTCHA: toSorted() not found when server side rendering on Vercel, hence `sort()`
    const sortedStartDates = [...startDates.values()]
    sortedStartDates.sort()
    const earliestStartDate = sortedStartDates[0]
    content = t('BUNDLE_DISCOUNT_SUMMARY_WITHOUT_TOTAL', {
      percentage,
      startDate: formatter.dateFull(new Date(earliestStartDate), { abbreviateMonth: true }),
    })
  }

  return (
    <BundleDiscountSummary>
      {content}{' '}
      <Link href={PageLink.bundleDiscount({ locale })} target="_blank" className={readMoreLink}>
        {t('READ_MORE', { ns: 'common' })}
      </Link>
    </BundleDiscountSummary>
  )
}
