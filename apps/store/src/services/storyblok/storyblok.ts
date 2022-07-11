import { SbBlokData } from '@storyblok/react'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
}
