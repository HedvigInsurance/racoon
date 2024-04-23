'use client'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import type { GlobalStory } from '@/services/storyblok/storyblok'
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

  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  return (
    <div className={clsx(wrapper, className)}>
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
