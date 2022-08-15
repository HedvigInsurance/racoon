import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { theme } from 'ui'

const spin = keyframes({
  '0%': {
    opacity: '0.25',
  },
  '50%': {
    opacity: '1',
    transform: 'scale(1.33)',
  },
  '100%': {
    opacity: 0.25,
  },
})

export type LoadingDotsProps = {
  color?: string
}
const Dots = styled.div<LoadingDotsProps>(({ color }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color,
}))

const Dot = styled.span({
  width: '0.375rem',
  height: '0.375rem',
  margin: '0.25rem',
  borderRadius: '100%',
  backgroundColor: 'currentColor',
  opacity: '0.25',
  animation: `${spin} 1000ms both infinite`,
  '& :nth-of-type(2)': {
    animationDelay: '150ms',
  },
  '&:last-of-type': {
    animationDelay: '300ms',
  },
})

export const LoadingDots = ({ color = theme.colors.gray800 }: LoadingDotsProps) => {
  return (
    <Dots color={color}>
      <Dot />
      <Dot />
      <Dot />
    </Dots>
  )
}
