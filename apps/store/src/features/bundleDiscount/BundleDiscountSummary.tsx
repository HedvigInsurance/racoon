import type { ReactNode } from 'react'
import { CampaignIcon, theme, Text } from 'ui'
import { bundleDiscountSummary } from '@/features/bundleDiscount/BundleDiscountSummary.css'

type Props = {
  children: ReactNode
}

export function BundleDiscountSummary({ children }: Props) {
  return (
    <div className={bundleDiscountSummary}>
      <CampaignIcon color={theme.colors.signalGreenElement} size={theme.fontSizes.sm} />
      <Text color="textSecondaryOnGray" size="sm">
        {children}
      </Text>
    </div>
  )
}
