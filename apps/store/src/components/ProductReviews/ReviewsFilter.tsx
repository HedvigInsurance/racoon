import styled from '@emotion/styled'
import { Space, theme } from 'ui'
import type { Score, ReviewsDistribution } from '@/features/memberReviews/memberReviews.types'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'

type Props = {
  reviewsDistribution: ReviewsDistribution
  selectedScore: Score
  onSelectedScoreChange: (score: Score) => void
}

export const ReviewsFilter = (props: Props) => {
  const handleFilterOptionClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const selectedScore = Number(event.currentTarget.value) as Score
    props.onSelectedScoreChange(selectedScore)
  }

  return (
    <Space y={0.25}>
      {props.reviewsDistribution.map(([score, percentage]) => (
        <ReviewsFilterOption
          key={score}
          value={score}
          selected={score === props.selectedScore}
          disabled={percentage === 0}
          onClick={handleFilterOptionClick}
        >
          <ReviewsDistributionByScore score={score} percentage={percentage} />
        </ReviewsFilterOption>
      ))}
    </Space>
  )
}

const ReviewsFilterOption = styled.button<{ selected: boolean }>(({ selected }) => ({
  width: '100%',
  backgroundColor: selected ? theme.colors.opaque1 : 'transparent',
  borderRadius: theme.radius.lg,

  ':disabled': {
    opacity: 0.6,
  },

  '@media (hover: hover)': {
    ':not(:disabled)': {
      ':hover': {
        backgroundColor: theme.colors.opaque1,
        cursor: 'pointer',
      },
    },
  },
}))
