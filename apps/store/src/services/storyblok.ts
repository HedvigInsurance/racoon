import { apiPlugin, SbBlokData, storyblokInit } from '@storyblok/react'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { PageBlock } from '@/blocks/PageBlock'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
}

export const initStoryblok = () => {
  const components = {
    heading: HeadingBlock,
    page: PageBlock,
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components,
  })
}
