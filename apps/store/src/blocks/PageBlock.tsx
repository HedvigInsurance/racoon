import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useDiscountBanner } from '@/utils/useDiscountBanner'

type PageBlockProps = SbBaseBlockProps<{
  body: Array<SbBlokData>
}>

export const PageBlock = ({ blok }: PageBlockProps) => {
  return (
    <>
      <Main {...storyblokEditable(blok)}>
        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </Main>
      <DiscountBannerTrigger />
    </>
  )
}
PageBlock.blockName = 'page'

// Optimization - this effect should run in component without children to avoid rerenders
const DiscountBannerTrigger = () => {
  useDiscountBanner()
  return null
}

const Main = styled.main({
  width: '100%',
})
