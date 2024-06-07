import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { BUNDLE_DISCOUNT_PROMO_PAGE_PATH } from '@/features/bundleDiscount/bundleDiscount'
import { readMoreLink } from '@/features/bundleDiscount/BundleDiscountSummary.css'
import type { CartFragmentFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import { BundleDiscountSummary } from './BundleDiscountSummary'

type Props = {
  cart: CartFragmentFragment
}

export function BundleDiscountCartSummary({ cart }: Props) {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')
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
    const earliestStartDate = [...startDates.values()].toSorted()[0]
    content = t('BUNDLE_DISCOUNT_SUMMARY_WITHOUT_TOTAL', {
      percentage,
      startDate: formatter.dateFull(new Date(earliestStartDate), { abbreviateMonth: true }),
    })
  }

  return (
    <BundleDiscountSummary>
      {content}{' '}
      <Link href={BUNDLE_DISCOUNT_PROMO_PAGE_PATH} target="_blank" className={readMoreLink}>
        {t('READ_MORE', { ns: 'common' })}
      </Link>
    </BundleDiscountSummary>
  )
}
