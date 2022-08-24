import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductGridBlockProps = SbBaseBlockProps<{
  title?: string
  items: Array<SbBlokData>
}>

export const ProductGridBlock = ({ blok }: ProductGridBlockProps) => {
  const items = useMemo(() => blok.items.map((item) => ({ key: item._uid, ...item })), [blok.items])

  return (
    <Wrapper>
      <ProductGrid title={blok.title} items={items} {...storyblokEditable(blok)}>
        {(nestedBlock) => <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />}
      </ProductGrid>
    </Wrapper>
  )
}
ProductGridBlock.blockName = 'productGrid'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
