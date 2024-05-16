import { useTranslation } from 'next-i18next'
import { CampaignIcon, theme } from 'ui'
import { bundleDiscountSummary } from '@/features/bundleDiscount/BundleDiscountSummary.css'
import type { CartFragmentFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  cost: CartFragmentFragment['cost']
  redeemedCampaign: Exclude<CartFragmentFragment['redeemedCampaign'], null | undefined>
}

export function BundleDiscountSummary({ cost, redeemedCampaign }: Props) {
  const formatter = useFormatter()
  const { t } = useTranslation('cart')

  const totalSaved = formatter.money({
    amount: cost.discount.amount * redeemedCampaign.discount.months,
    currencyCode: cost.net.currencyCode,
  })
  return (
    <div className={bundleDiscountSummary}>
      <CampaignIcon color={theme.colors.signalGreenElement} size={theme.fontSizes.sm} />
      {t('BUNDLE_DISCOUNT_SUMMARY', {
        percentage: redeemedCampaign.discount.percentage + '%',
        totalSaved,
      })}
    </div>
  )
}
