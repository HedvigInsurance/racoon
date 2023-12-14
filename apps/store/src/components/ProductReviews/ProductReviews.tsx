import styled from '@emotion/styled'
import { Space, theme } from 'ui'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { Rating } from './Rating'
import { ReviewsDistribution } from './ReviewsDistribution'

const MAX_SCORE = 5

type Props = {
  calculationExplanation?: string
}

export const ProductReviews = (props: Props) => {
  const { averageRating, reviewComments } = useProductPageContext()

  if (!averageRating || !reviewComments) {
    // We already log the absence of 'averageRating'/'reviewComments' during build time
    return null
  }

  return (
    <Wrapper y={3.5}>
      <Rating
        score={averageRating.score}
        maxScore={MAX_SCORE}
        reviewsCount={averageRating.reviewCount}
        explanation={props.calculationExplanation}
      />

      <ReviewsDistribution reviews={reviewComments} />
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  width: 'min(28.5rem, 100%)',
  marginInline: 'auto',
  paddingInline: theme.space.md,
  textAlign: 'center',
})
