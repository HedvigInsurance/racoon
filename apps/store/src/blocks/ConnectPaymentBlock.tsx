import type { SbBlokData } from '@storyblok/react'
import { storyblokEditable, StoryblokComponent } from '@storyblok/react'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ConnectPaymentBlockProps = SbBaseBlockProps<{
  body?: Array<SbBlokData>
}>

export function ConnectPaymentBlock({ blok }: ConnectPaymentBlockProps) {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </div>
  )
}
