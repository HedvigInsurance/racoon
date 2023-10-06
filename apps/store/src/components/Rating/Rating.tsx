import styled from '@emotion/styled'
import { theme } from 'ui'

type Props = {
  score: number
}

export const Rating = styled.div<Props>(({ score }) => ({
  '--percentage': `calc(${score} / 5 * 100%)`,

  display: 'inline-block',
  lineHeight: 1,
  fontSize: theme.fontSizes.xxl,
  fontFamily: 'Times', // make sure ★ appears correctly

  '&::before': {
    content: '"★★★★★"',
    background: `linear-gradient(
      to right,
      ${theme.colors.gray1000} var(--percentage),
      ${theme.colors.gray300} var(--percentage)
    )`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}))
