'use client'
import { StoryblokComponent } from '@storyblok/react'
import { clsx } from 'clsx'
import { Fragment, ReactNode } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { ReusableBlockReference } from '@/blocks/ReusableBlockReference'
import { GlobalStory } from '@/services/storyblok/storyblok'
import { filterByBlockType, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { wrapper } from './StoryblokLayout.css'

// TODO: Render layout and page server-side
export const StoryblokLayout = ({
  children,
  globalStory,
  className,
}: {
  children: ReactNode
  globalStory: GlobalStory
  className?: string
}) => {
  // TODO: How should we pass story data here ?  For now, let's pretend it's non-story page
  // Removed breadcrumbs from page router LayoutWithMenu, kept other flags in fixed state
  const story: any = null

  // Announcements are added as reusable blocks for Page and ProductPage content types
  const reusableBlock = filterByBlockType(
    story?.content.announcement,
    ReusableBlockReference.blockName,
  )
  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  return (
    <div className={clsx(wrapper, className)}>
      {/* TODO: Make announcement part of page rendering, same as breadcrumbs */}
      {reusableBlock.map((referencedBlok) => (
        <StoryblokComponent key={referencedBlok._uid} blok={referencedBlok} />
      ))}
      {headerBlock.map((nestedBlock) => (
        // TODO: derive `static` from story DOM, similar to `data-hide-footer`, etc
        <HeaderBlock
          key={nestedBlock._uid}
          blok={nestedBlock}
          static={story && isProductStory(story)}
        />
      ))}
      {children}
      {footerBlock.map((nestedBlock) => (
        <Fragment key={nestedBlock._uid}>
          <FooterBlock key={nestedBlock._uid} blok={nestedBlock} />
        </Fragment>
      ))}
    </div>
  )
}
