import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ConfirmationPageBlockProps = SbBaseBlockProps<{
  body: SbBlokData[]
}>

export const ConfirmationPageBlock = ({ blok }: ConfirmationPageBlockProps) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </div>
  )
}

ConfirmationPageBlock.blockName = 'confirmation'
