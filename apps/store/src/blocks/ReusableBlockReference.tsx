import { StoryblokComponent } from '@storyblok/react'
import { ReferenceStory, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ReusableBlockReferenceProps = SbBaseBlockProps<{
  reference: ReferenceStory
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
