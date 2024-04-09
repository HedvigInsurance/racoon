import type { SbBlokData } from '@storyblok/react/rsc';
import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc'
import { DiscountBannerTrigger } from '@/components/DiscountBannerTrigger'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { announcementBanner, main } from './PageBlock.css'

type PageBlockProps = SbBaseBlockProps<{
  body: Array<SbBlokData>
  announcement?: Array<any>
}>

export const PageBlock = ({ blok }: PageBlockProps) => {
  // Announcements are added as reusable blocks for Page and ProductPage content types
  const announcementBlocks = filterByBlockType(blok.announcement, 'reusableBlockReference')
  return (
    <>
      {announcementBlocks.map((blok) => (
        <StoryblokComponent key={blok._uid} blok={blok} className={announcementBanner} />
      ))}
      <main
        className={main}
        {...storyblokEditable(blok)}
        data-dark-background={!!blok.darkBackground}
        data-overlay-menu={!!blok.overlayMenu}
        data-hide-chat={!!blok.hideChat}
      >
        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </main>
      <DiscountBannerTrigger />
    </>
  )
}
PageBlock.blockName = 'page'
