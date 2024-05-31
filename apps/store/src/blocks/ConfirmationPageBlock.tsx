'use client'
import type { SbBlokData } from '@storyblok/react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ConfirmationPageBlockProps = SbBaseBlockProps<{
  body?: Array<SbBlokData>
}>

export const ConfirmationPageBlock = ({ blok }: ConfirmationPageBlockProps) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlock) => (
        // TODO: try inlining this, we're not using confirmationPage block type
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </div>
  )
}
