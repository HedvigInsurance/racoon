import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock/FooterBlock'
import { HeaderBlock as HeaderBlockNew } from '@/blocks/HeaderBlock/HeaderBlock'
import type { GlobalStory } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { wrapper } from './StoryblokLayout.css'

export const StoryblokLayout = ({
  children,
  globalStory,
  className,
}: {
  children: ReactNode
  globalStory: GlobalStory
  className?: string
}) => {
  const headerBlock = filterByBlockType(globalStory.content.header, 'header')
  const footerBlock = filterByBlockType(globalStory.content.footer, 'footer')

  return (
    <div className={clsx(wrapper, className)}>
      {headerBlock.map((nestedBlock) => (
        <HeaderBlockNew key={nestedBlock._uid} blok={nestedBlock} />
      ))}
      {children}
      {footerBlock.map((nestedBlock) => (
        <FooterBlock key={nestedBlock._uid} blok={nestedBlock} />
      ))}
    </div>
  )
}
