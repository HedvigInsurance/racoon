'use client'

import { StoryblokComponent } from '@storyblok/react'
import type { ReusableStory, SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ReusableBlockReferenceProps = SbBaseBlockProps<{
  reference: Omit<ReusableStory, 'content'> & Partial<Pick<ReusableStory, 'content'>>
}> & {
  className?: string
}

export const ReusableBlockReference = ({ blok, className }: ReusableBlockReferenceProps) => {
  return (
    <>
      {blok.reference.content?.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} className={className} />
      ))}
    </>
  )
}

ReusableBlockReference.blockName = 'reusableBlockReference'
