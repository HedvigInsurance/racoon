'use client'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import type { GlobalStory } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
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
  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory.content.footer, FooterBlock.blockName)

  return (
    <div className={clsx(wrapper, className)}>
      {headerBlock.map((nestedBlock) => (
        <HeaderBlock key={nestedBlock._uid} blok={nestedBlock} />
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
