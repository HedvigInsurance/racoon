import { theme } from 'ui'
import { TrustpilotWidget } from '@/services/trustpilot/TruspilotWidget'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const TrustpilotReviewsBlock = () => {
  const { language } = useCurrentLocale()

  return (
    <TrustpilotWidget
      variant="testimonials"
      style={{ paddingInline: theme.space.md }}
      data-style-width="100%"
      data-style-height="750px"
      data-stars="1,2,3,4,5"
      data-review-languages={language}
    />
  )
}

TrustpilotReviewsBlock.blockName = 'trustpilotReviews'
