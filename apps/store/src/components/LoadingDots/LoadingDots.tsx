import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { theme } from 'ui'

export type LoadingDotsProps = {
  className?: string
  color?: string
}

const spin = keyframes`
  0% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
    transform: scale(1.33)
  }
  100% {
    opacity: 0.25;
  }
`

const Dots = styled.div<LoadingDotsProps>(({ color }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: `${color}`,
}))

const Dot = styled.span`
  width: 0.375rem;
  height: 0.375rem;
  margin: 0.25rem;
  border-radius: 100%;
  background-color: currentColor;
  opacity: 0.25;
  opacity: 0.25;
  animation: ${spin} 1000ms both infinite;
  &:nth-of-type(2) {
    animation-delay: 150ms;
  }
  &:last-of-type {
    animation-delay: 300ms;
  }
`

export const LoadingDots = ({ className, color = theme.colors.gray100 }: LoadingDotsProps) => {
  return (
    <Dots className={className} color={color}>
      <Dot />
      <Dot />
      <Dot />
    </Dots>
  )
}
