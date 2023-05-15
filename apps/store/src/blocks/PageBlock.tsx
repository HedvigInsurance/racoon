import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useDiscountBanner } from '@/utils/useDiscountBanner'

type PageBlockProps = SbBaseBlockProps<{
  body: SbBlokData[]
}>

export const PageBlock = ({ blok }: PageBlockProps) => {
  useDiscountBanner()
  return (
    <Main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </Main>
  )
}

PageBlock.blockName = 'page'

const Main = styled.main({
  width: '100%',
})
