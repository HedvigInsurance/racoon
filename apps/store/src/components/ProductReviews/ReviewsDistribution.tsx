import { useMemo } from 'react'
import { getReviewsDistribution } from '@/services/productReviews/getReviewsDistribution'
import type { ReviewComments } from '@/services/productReviews/productReviews.types'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'

type Props = {
  reviews: ReviewComments
}

export const ReviewsDistribution = (props: Props) => {
  const reviewsDistribution = useMemo(() => getReviewsDistribution(props.reviews), [props.reviews])

  return (
    <div>
      {reviewsDistribution.map(([score, percentage]) => (
        <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
      ))}
    </div>
  )
}
