import styled from '@emotion/styled'
import React from 'react'
import { mq, theme } from 'ui'

type InsurableLimitsProps = {
  children: React.ReactNode
  className?: string
}

export const InsurableLimits = ({ children, className }: InsurableLimitsProps) => {
  return (
    <Wrapper className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollableItem key={index}>{child}</ScrollableItem>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  gap: theme.space[2],
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',

  [mq.lg]: {
    gap: theme.space[4],
  },
})

const ScrollableItem = styled.div({
  scrollSnapAlign: 'center',
  flexShrink: 0,
  maxWidth: '96%',

  [mq.sm]: {
    maxWidth: '20rem',
  },
})
