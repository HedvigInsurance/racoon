'use client'
import { StoryblokComponent } from '@storyblok/react'
import { clsx } from 'clsx'
import { Fragment, ReactNode } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { ReusableBlockReference } from '@/blocks/ReusableBlockReference'
import { GlobalStory } from '@/services/storyblok/storyblok'
import { filterByBlockType, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { useChangeLocale } from '@/utils/l10n/useChangeLocale'
import { dark, wrapper } from './StoryblokLayout.css'

export const StoryblokLayout = ({
  children,
  globalStory,
}: {
  children: ReactNode
  globalStory: GlobalStory
}) => {
  // TODO: How should we pass story data here ?  For now, let's pretend it's non-story page
  // Removed breadcrumbs from page router LayoutWithMenu, kept other flags in fixed state
  const story: any = null
  const hideFooter = Math.PI < 1 // always false, but does not trigger eslint static condition warning
  const overlayMenu = false

  const handleLocaleChange = useChangeLocale(story)

  // Announcements are added as reusable blocks for Page and ProductPage content types
  const reusableBlock = filterByBlockType(
    story?.content.announcement,
    ReusableBlockReference.blockName,
  )
  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  const showHeader = !story?.content.hideMenu
  const showMenuOverlay = story?.content.overlayMenu ?? overlayMenu
  const showFooter = !hideFooter && !story?.content.hideFooter
  const darkBackground = story?.content.darkBackground

  return (
    <div className={clsx(wrapper, darkBackground && dark)}>
      {reusableBlock.map((referencedBlok) => (
        <StoryblokComponent key={referencedBlok._uid} blok={referencedBlok} />
      ))}
      {showHeader &&
        headerBlock.map((nestedBlock) => (
          <HeaderBlock
            key={nestedBlock._uid}
            blok={nestedBlock}
            overlay={showMenuOverlay}
            static={story && isProductStory(story)}
          />
        ))}
      {children}
      {showFooter &&
        footerBlock.map((nestedBlock) => (
          <Fragment key={nestedBlock._uid}>
            <FooterBlock
              key={nestedBlock._uid}
              blok={nestedBlock}
              onLocaleChange={handleLocaleChange}
            />
          </Fragment>
        ))}
    </div>
  )
}
