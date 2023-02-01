import styled from '@emotion/styled'
import React from 'react'
import { mq, Space, theme } from 'ui'

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

const Title = styled.h2({
  fontSize: theme.fontSizes.sm,
  color: theme.colors.gray600,
  textTransform: 'uppercase',
  textAlign: 'center',
})

const ScollableContainer = styled.div<{ alignment: Alignment }>(({ alignment }) => ({
  display: 'flex',
  gap: theme.space.xs,
  paddingInline: theme.space.xs,
  paddingBottom: theme.space.md,
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
  [mq.md]: {
    gap: theme.space.md,
  },
  ...getAligmentStyles(alignment),
}))

const ScrollableItem = styled.div({
  scrollSnapAlign: 'center',
})

const getAligmentStyles = (alignment: Alignment) => {
  switch (alignment) {
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
