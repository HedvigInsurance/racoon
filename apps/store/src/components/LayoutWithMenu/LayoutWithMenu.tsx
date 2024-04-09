import { StoryblokComponent } from '@storyblok/react'
import { clsx } from 'clsx'
import { Fragment, type ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { ReusableBlockReference } from '@/blocks/ReusableBlockReference'
import { wrapper } from '@/components/LayoutWithMenu/LayoutWithMenu.css'
import type { GlobalStory, PageStory } from '@/services/storyblok/storyblok'
import { filterByBlockType, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import type { GlobalProductMetadata } from './fetchProductMetadata';
import { GLOBAL_PRODUCT_METADATA_PROP_NAME } from './fetchProductMetadata'
import { useHydrateProductMetadata } from './productMetadataHooks'

type LayoutWithMenuProps = {
  children: ReactElement<{
    className: string
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
    story: PageStory | undefined
    globalStory: GlobalStory | undefined
  }>
  hideFooter?: boolean
  hideMenu?: boolean
}

export const LayoutWithMenu = (props: LayoutWithMenuProps) => {
  const { story, globalStory, className } = props.children.props

  useHydrateProductMetadata(props.children.props[GLOBAL_PRODUCT_METADATA_PROP_NAME])

  // Happens for transitions from pages with layout to pages without layout
  if (!globalStory) return null

  // Announcements are added as reusable blocks for Page and ProductPage content types
  const announcementBlocks = filterByBlockType(
    story?.content.announcement,
    ReusableBlockReference.blockName,
  )
  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  return (
    <>
      <div className={clsx(wrapper, className)}>
        {announcementBlocks.map((referencedBlok) => (
          <StoryblokComponent key={referencedBlok._uid} blok={referencedBlok} />
        ))}
        {!props.hideMenu &&
          headerBlock.map((nestedBlock) => (
            <HeaderBlock
              key={nestedBlock._uid}
              blok={nestedBlock}
              static={story && isProductStory(story)}
            />
          ))}
        {props.children}
        {!props.hideFooter &&
          footerBlock.map((nestedBlock) => (
            <FooterBlock key={nestedBlock._uid} blok={nestedBlock} />
          ))}
      </div>
    </>
  )
}
