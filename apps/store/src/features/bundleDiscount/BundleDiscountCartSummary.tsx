import { useTranslation } from 'next-i18next'
import type { CartFragmentFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import { BundleDiscountSummary } from './BundleDiscountSummary'

type Props = {
  cost: CartFragmentFragment['cost']
  redeemedCampaign: Exclude<CartFragmentFragment['redeemedCampaign'], null | undefined>
}

export function BundleDiscountCartSummary({ cost, redeemedCampaign }: Props) {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')

  const totalSaved = formatter.money({
    amount: cost.discount.amount * redeemedCampaign.discount.months,
    currencyCode: cost.net.currencyCode,
  })
  return (
    <BundleDiscountSummary>
      {t('BUNDLE_DISCOUNT_SUMMARY', {
        percentage: redeemedCampaign.discount.percentage + '%',
        totalSaved,
      })}
    </BundleDiscountSummary>
  )
}
