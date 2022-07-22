import { storyblokEditable } from '@storyblok/react'
import { Heading } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type HeadingBlockProps = SbBaseBlockProps<{
  text: string
}>

export const HeadingBlock = ({ blok }: HeadingBlockProps) => {
  return (
    <Heading as="h2" variant="standard.32" {...storyblokEditable(blok)}>
      {blok.text}
    </Heading>
  )
}
