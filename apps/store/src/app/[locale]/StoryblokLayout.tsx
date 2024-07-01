import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock/HeaderBlock'
import { HeaderBlock as HeaderBlockNew } from '@/blocks/HeaderBlockNew/HeaderBlock'
import type { GlobalStory } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { Features } from '@/utils/Features'
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
      {headerBlock.map((nestedBlock) =>
        Features.enabled('NEW_HEADER') ? (
          <HeaderBlockNew key={nestedBlock._uid} blok={nestedBlock} />
        ) : (
          <HeaderBlock key={nestedBlock._uid} blok={nestedBlock} />
        ),
      )}
      {children}
      {footerBlock.map((nestedBlock) => (
        <FooterBlock key={nestedBlock._uid} blok={nestedBlock} />
      ))}
    </div>
  )
}
