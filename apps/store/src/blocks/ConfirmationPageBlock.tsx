'use client'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

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
