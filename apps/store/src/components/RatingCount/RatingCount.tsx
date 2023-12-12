import styled from '@emotion/styled'
import { Text, theme, mq } from 'ui'
import { Stars } from '@/components/Stars/Stars'

type Props = {
  score: number
  scoreReviewCount: number
  totalReviewCount: number
}

export const RatingCount = (props: Props) => {
  const scoreCountPercentage = (props.scoreReviewCount / props.totalReviewCount) * 100 + '%'

  return (
    <Wrapper>
      <Stars score={props.score} />
      <Progress reviewCount={scoreCountPercentage} />
      <Text>{scoreCountPercentage}</Text>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.md,
  width: 'min(28.5rem, 100%)',
  padding: theme.space.md,
  borderRadius: theme.radius.md,

  [mq.md]: {
    padding: theme.space.lg,
    borderRadius: theme.radius.lg,
  },
})

const Progress = styled.div(({ reviewCount }: { reviewCount: string }) => ({
  position: 'relative',
  flex: '1 1',
  height: '0.25rem',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.opaque3,

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: reviewCount,
    borderRadius: 'inherit',
    backgroundColor: theme.colors.textPrimary,
  },
}))
