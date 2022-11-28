import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductPageBlockProps = SbBaseBlockProps<{
  overview: SbBlokData[]
  coverage: SbBlokData[]
  body: SbBlokData[]
}>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  return (
    <Main {...storyblokEditable(blok)}>
      <PurchaseForm />
      {blok.overview?.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
      {blok.coverage?.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </Main>
  )
}

ProductPageBlock.blockName = 'product'

const Main = styled.main({
  width: '100%',
})
