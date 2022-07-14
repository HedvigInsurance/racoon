import { storyblokEditable } from '@storyblok/react'
import { SbBaseBlockProps } from '@/services/storyblok'

type HeadingBlockProps = SbBaseBlockProps<{
  text: string
}>

export const HeadingBlock = ({ blok }: HeadingBlockProps) => {
  return <h2 {...storyblokEditable(blok)}>{blok.text}</h2>
}
