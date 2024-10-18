import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from 'ui/src/theme/theme'

type Props = {
  color?: string
}

export const LoadingDots = ({ color = theme.colors.gray800 }: Props) => {
  return (
    <Dots color={color}>
      <Dot />
      <Dot />
      <Dot />
    </Dots>
  )
}

const Dots = styled.div<Props>(({ color }) => ({
  width: '1.875rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color,
}))

const spin = keyframes({
  '0%': { opacity: 0.25 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.25 },
})

const DOT_SIZE = '0.375rem'

const Dot = styled.span({
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: '100%',
  backgroundColor: 'currentColor',
  opacity: 0.25,
  animation: `${spin} 1000ms both infinite`,

  '&:nth-of-type(2)': { animationDelay: '150ms' },
  '&:nth-of-type(3)': { animationDelay: '300ms' },
})
