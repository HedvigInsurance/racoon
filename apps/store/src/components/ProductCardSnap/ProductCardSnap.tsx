import styled from '@emotion/styled'
import React from 'react'

export type ProductCardSnapProps = {
  children: React.ReactNode | Array<React.ReactNode>
}

export const ProductCardSnap = ({ children }: ProductCardSnapProps) => {
  return (
    <ScollableContainer>
      {React.Children.map(children, (child, index) => (
        <ScrollableItem key={index}>{child}</ScrollableItem>
      ))}
    </ScollableContainer>
  )
}

const ScollableContainer = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.space[2],
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
}))

const ScrollableItem = styled.div({
  scrollSnapAlign: 'center',
})
