import styled from '@emotion/styled'
import React from 'react'
import { Space } from 'ui'

export type SlideshowProps = {
  children: React.ReactNode | Array<React.ReactNode>
  title?: string
}

export const Slideshow = ({ children, title }: SlideshowProps) => {
  return (
    <Space y={1.5}>
      {title && <Title>{title}</Title>}
      <ScollableContainer>
        {React.Children.map(children, (child, index) => (
          <ScrollableItem key={index}>{child}</ScrollableItem>
        ))}
      </ScollableContainer>
    </Space>
  )
}

const Title = styled.h2(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  color: theme.colors.gray600,
  textTransform: 'uppercase',
  textAlign: 'center',
}))

const ScollableContainer = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.space[2],
  paddingBottom: theme.space[4],
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
}))

const ScrollableItem = styled.div({
  scrollSnapAlign: 'center',
})
