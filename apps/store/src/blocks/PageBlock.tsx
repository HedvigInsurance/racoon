import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok'

type PageBlockProps = SbBaseBlockProps<{
  body: SbBlokData[]
}>

export const PageBlock = ({ blok }: PageBlockProps) => {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </main>
  )
}
