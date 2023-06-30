import type { ISbRichtext, ISbStoryData, SbBlokData } from '@storyblok/react'
import type { SEOData, StoryblokAsset } from '@/services/storyblok/storyblok'

export type BlogArticleContentType = ISbStoryData<
  {
    date: string
    footer: Array<SbBlokData>
    body: Array<SbBlokData>
    content: ISbRichtext
    // While editing, categories are just UUIDs
    categories: Array<ISbStoryData> | Array<string>
    teaser_text: string
    page_heading: string
    teaser_image: StoryblokAsset
  } & SEOData
>

export type BlogArticleCategory = {
  id: string
  name: string
  href: string
}

export type BlogArticleTeaser = {
  id: string
  href: string
  heading: string
  date: string
  categories: Array<BlogArticleCategory>
  text: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
}
