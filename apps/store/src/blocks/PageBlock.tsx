import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import type { PageStory } from '@/services/storyblok/storyblok'
import { main } from './PageBlock.css'

type PageBlockProps = {
  blok: PageStory['content']
}

export const PageBlock = ({ blok }: PageBlockProps) => {
  return (
    <>
      <main
        className={main}
        {...storyblokEditable(blok)}
        data-dark-background={!!blok.darkBackground}
        data-overlay-menu={!!blok.overlayMenu}
        data-hide-chat={!!blok.hideChat}
        data-supports-sticky-header={true}
      >
        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </main>
      <PageBannerTriggers blok={blok} />
    </>
  )
}
PageBlock.blockName = 'page'
