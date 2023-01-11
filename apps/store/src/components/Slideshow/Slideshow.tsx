import styled from '@emotion/styled'
import React from 'react'
import { mq, Space } from 'ui'

type Alignment = 'left' | 'center' | 'right'

export type SlideshowProps = {
  children: React.ReactNode | Array<React.ReactNode>
  alignment?: Alignment
  title?: string
}

export const Slideshow = ({ children, title, alignment = 'left' }: SlideshowProps) => {
  return (
    <Space y={1.5}>
      {title && <Title>{title}</Title>}
      <ScollableContainer alignment={alignment}>
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

const ScollableContainer = styled.div<{ alignment: Alignment }>(({ theme, alignment }) => ({
  display: 'flex',
  gap: theme.space[2],
  paddingInline: theme.space[2],
  paddingBottom: theme.space[4],
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
  [mq.md]: {
    gap: theme.space[4],
  },
  ...getAligmentStyles(alignment),
}))

const ScrollableItem = styled.div({
  scrollSnapAlign: 'center',
})

const getAligmentStyles = (aligment: Alignment) => {
  switch (aligment) {
    case 'left':
      return {
        justifyContent: 'flex-start',
      }
    case 'center':
      return {
        // This is a workaround for centralizing content in containers that may scroll.
        // Using justify-content: center; on a scroll container will cause an issue where
        // the first item will be cutted out. margin: auto; will absorb any extra space in a
        // flex container. There is a CSS working draft that solves this
        // issue: justify-content: center safe; However it's not well support yet.
        // More info --> http://bitly.ws/y7ak
        [`& ${ScrollableItem}:first-of-type`]: {
          marginLeft: 'auto',
        },
        [`& ${ScrollableItem}:last-of-type`]: {
          marginRight: 'auto',
        },
      }
    case 'right':
      return { justifyContent: 'flex-end' }
  }
}
