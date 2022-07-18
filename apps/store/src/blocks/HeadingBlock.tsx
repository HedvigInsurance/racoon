import { storyblokEditable } from '@storyblok/react'
import { Heading } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type HeadingBlockProps = SbBaseBlockProps<{
  text: string
}>

export const HeadingBlock = ({ blok }: HeadingBlockProps) => {
  return (
    <Heading headingLevel="h2" colorVariant="dark" variant="m" {...storyblokEditable(blok)}>
      {blok.text}
    </Heading>
  )
}
