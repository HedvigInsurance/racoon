'use client'

import { StoryblokComponent } from '@storyblok/react'
import type { ReusableStory, SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type ReusableBlockReferenceProps = SbBaseBlockProps<{
  reference: Omit<ReusableStory, 'content'> & Partial<Pick<ReusableStory, 'content'>>
}>

export const ReusableBlockReference = ({ blok }: ReusableBlockReferenceProps) => {
  return (
    <>
      {blok.reference.content?.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </>
  )
}

ReusableBlockReference.blockName = 'reusableBlockReference'
