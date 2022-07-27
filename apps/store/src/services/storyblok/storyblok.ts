import { apiPlugin, getStoryblokApi, SbBlokData, storyblokInit, StoryData } from '@storyblok/react'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
}

export type StoryblokPageProps = {
  story: StoryData
}

export type StoryblokQueryParams = {
  slug: string[]
}

export type StoryblokImage = {
  alt: string
  copyright: string
  fieldtype: 'asset'
  filename: string
  focus: string
  id: number
  is_external_url: boolean
  name: string
  title: string
}

export type LinkField = {
  id: string
  url: string
  linktype: 'story' | 'url'
  cached_url: string // use this
}

export const initStoryblok = () => {
  const components = {
    button: ButtonBlock,
    heading: HeadingBlock,
    hero: HeroBlock,
    page: PageBlock,
    productCard: ProductCardBlock,
    productGrid: ProductGridBlock,
    spacer: SpacerBlock,
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components,
  })
}

export const getStoryBySlug = async (slug: string, preview = false) => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: preview ? 'draft' : 'published',
  })
  return data.story
}

export const getAllLinks = async () => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get('cdn/links/')
  return data.links
}
