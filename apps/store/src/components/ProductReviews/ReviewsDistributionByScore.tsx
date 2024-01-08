import styled from '@emotion/styled'
import { Text, theme } from 'ui'
import { Stars } from './Stars'

type Props = {
  score: number
  percentage: number
}

export const ReviewsDistributionByScore = (props: Props) => {
  return (
    <Wrapper>
      <Stars score={props.score} />
      <AmountBar filledPortion={props.percentage} />
      <PercentageLabel>{props.percentage + '%'}</PercentageLabel>
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
})

const AmountBar = styled.div(({ filledPortion }: { filledPortion: number }) => ({
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
    width: `${filledPortion}%`,
    borderRadius: 'inherit',
    backgroundColor: theme.colors.textPrimary,
  },
}))

const PercentageLabel = styled(Text)({
  // A fixed size ensures percentage labels are aligned
  width: '2.8rem',
  textAlign: 'right',
})
