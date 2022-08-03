import styled from '@emotion/styled'
import React from 'react'
import { ProductCard, ProductCardProps } from './ProductCard'

type ProductData = {
  title: ProductCardProps['title']
  subtitle: ProductCardProps['subtitle']
  image: ProductCardProps['image']
}

export type SlideshowProps = {
  products: Array<ProductData>
}

export const Slideshow = ({ products }: SlideshowProps) => {
  return (
    <ScollableContainer>
      {products.map(({ title, subtitle, image }, index) => (
        <ScrollableItem key={`${title}-${index}`}>
          <ProductCard title={title} subtitle={subtitle} image={image} />
        </ScrollableItem>
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
