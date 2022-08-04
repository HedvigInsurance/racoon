import { apiPlugin, getStoryblokApi, SbBlokData, storyblokInit, StoryData } from '@storyblok/react'
import { ButtonBlock } from '@/blocks/ButtonBlock'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { PageBlock } from '@/blocks/PageBlock'
import { PriceCalculatorBlock } from '@/blocks/PriceCalculatorBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductGridBlock } from '@/blocks/ProductGridBlock'
import { ProductSlideshowBlock } from '@/blocks/ProductSlideshowBlock'
import { ProductSummaryBlock } from '@/blocks/ProductSummaryBlock'
import { SpacerBlock } from '@/blocks/SpacerBlock'
import { TopPickCardBlock } from '@/blocks/TopPickCardBlock'

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

export type ProductStory = StoryData & {
  content: StoryData['content'] & {
    name: string
    productId: string
    priceFormTemplateId: string
    body: Array<SbBlokData>
  }
}

export enum StoryblokBlockName {
  Button = 'button',
  Heading = 'heading',
  Hero = 'hero',
  Page = 'page',
  Product = 'product',
  ProductCard = 'productCard',
  ProductGrid = 'productGrid',
  ProductSummary = 'productSummary',
  Spacer = 'spacer',
  PriceCalculator = 'priceCalculator',
  TopPickCard = 'topPickCard',
  ProductSlideshow = 'productSlideshow',
}

export const initStoryblok = () => {
  const components = {
    [StoryblokBlockName.Button]: ButtonBlock,
    [StoryblokBlockName.Heading]: HeadingBlock,
    [StoryblokBlockName.Hero]: HeroBlock,
    [StoryblokBlockName.Page]: PageBlock,
    [StoryblokBlockName.Product]: PageBlock,
    [StoryblokBlockName.ProductCard]: ProductCardBlock,
    [StoryblokBlockName.ProductGrid]: ProductGridBlock,
    [StoryblokBlockName.ProductSummary]: ProductSummaryBlock,
    [StoryblokBlockName.PriceCalculator]: PriceCalculatorBlock,
    [StoryblokBlockName.Spacer]: SpacerBlock,
    [StoryblokBlockName.TopPickCard]: TopPickCardBlock,
    [StoryblokBlockName.ProductSlideshow]: ProductSlideshowBlock,
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

export const getProductStory = async (slug: string, preview = false) => {
  const story = await getStoryBySlug(`/products/${slug}`, preview)
  return story as ProductStory
}

export const getStoreStory = async (preview = false) => {
  const story = await getStoryBySlug('/store', preview)
  return story as StoryData
}
