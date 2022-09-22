import { StoryblokComponent } from '@storyblok/react'
import { GlobalStory, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type GlobalReferenceBlockProps = SbBaseBlockProps<{
  reference: GlobalStory
}>

export const GlobalReferenceBlock = ({ blok }: GlobalReferenceBlockProps) => {
  return (
    <>
      {blok.reference.content?.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </>
  )
}

GlobalReferenceBlock.blockName = 'globalReference'
