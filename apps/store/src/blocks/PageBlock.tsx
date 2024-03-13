import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react/rsc'
import { DiscountBannerTrigger } from '@/components/DiscountBannerTrigger'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { main } from './PageBlock.css'

type PageBlockProps = SbBaseBlockProps<{
  body: Array<SbBlokData>
}>

export const PageBlock = ({ blok }: PageBlockProps) => {
  return (
    <>
      <main className={main} {...storyblokEditable(blok)}>
        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </main>
      <DiscountBannerTrigger />
    </>
  )
}
PageBlock.blockName = 'page'
