import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
import { useTrustpilotData } from '@/features/memberReviews/TrustpilotDataProvider'

export const TABS = {
  PRODUCT: 'product',
  TRUSTPILOT: 'trustpilot',
} as const

export type Tab = (typeof TABS)[keyof typeof TABS]

type Props = {
  selectedTab: Tab
  onTabChange: (tab: Tab) => void
}

export const ReviewTabs = (props: Props) => {
  const { t } = useTranslation('common')
  const productReviewsData = useProuctReviewsDataContext()
  const trustpilotData = useTrustpilotData()

  const handleTabChange: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const tab = event.currentTarget.value as Tab
    props.onTabChange(tab)
  }

  if (!productReviewsData || !trustpilotData) {
    return null
  }

  return (
    <SpaceFlex space={0.5}>
      <Button
        value={TABS.PRODUCT}
        size="medium"
        variant={props.selectedTab === TABS.PRODUCT ? 'primary-alt' : 'secondary'}
        fullWidth={true}
        onClick={handleTabChange}
      >
        {t('PRODUCT_REVIEWS_TAB_LABEL', { score: productReviewsData.averageRating.score })}
      </Button>
      <Button
        value={TABS.TRUSTPILOT}
        size="medium"
        variant={props.selectedTab === TABS.TRUSTPILOT ? 'primary-alt' : 'secondary'}
        fullWidth={true}
        onClick={handleTabChange}
      >
        {t('TRUSTPILOT_REVIEWS_TAB_LABEL', { score: trustpilotData.averageRating.score })}
      </Button>
    </SpaceFlex>
  )
}
