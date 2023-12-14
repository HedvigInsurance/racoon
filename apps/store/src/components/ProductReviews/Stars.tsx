import styled from '@emotion/styled'
import { StarIcon, theme, mq } from 'ui'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'

type Props = {
  score: string
}

export const Stars = (props: Props) => {
  return (
    <Wrapper>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} filled={index < Math.trunc(Number(props.score))} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  gap: theme.space.xxxs,

  [mq.md]: {
    gap: theme.space.xxs,
  },
})

const Star = ({ filled }: { filled: boolean }) => {
  const isDesktop = useBreakpoint('md')

  return (
    <StarIcon
      color={filled ? theme.colors.textTranslucentPrimary : theme.colors.textTranslucentTertiary}
      size={isDesktop ? '1.5rem' : '1rem'}
    />
  )
}
