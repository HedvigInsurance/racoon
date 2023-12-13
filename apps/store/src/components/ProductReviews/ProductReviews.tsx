import styled from '@emotion/styled'
import { theme } from 'ui'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { Rating } from './Rating'

const MAX_SCORE = 5

type Props = {
  calculationExplanation?: string
}

export const ProductReviews = (props: Props) => {
  const { averageRating } = useProductPageContext()

  if (!averageRating) {
    // We already log the absence of 'averageRating' durinb build time
    return null
  }

  return (
    <Wrapper>
      <Rating
        score={averageRating.score}
        maxScore={MAX_SCORE}
        reviewsCount={averageRating.reviewCount}
        explanation={props.calculationExplanation}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div({
  width: 'min(28.5rem, 100%)',
  marginInline: 'auto',
  paddingInline: theme.space.md,
  textAlign: 'center',
})
