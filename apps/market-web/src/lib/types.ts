import type { StoryData, StoryblokComponent } from 'storyblok-js-client'

import { MarkdownHtmlComponent } from '@/blocks/BaseBlockProps'

export type StoryblokComponentName = 'headline_block' | 'spacer_block' | 'plain_text_block'

interface StoryblokBaseBlock extends StoryblokComponent<StoryblokComponentName> {}

export interface SBSpacerBlock extends StoryblokBaseBlock {
  component: 'spacer_block'
  size: string
}

export interface SBHeadlineBlock extends StoryblokBaseBlock {
  component: 'headline_block'
  text_one: { html: string }
  text_two: { html: string }
}

export interface SBPlainTextBlock extends StoryblokBaseBlock {
  component: 'plain_text_block'
  content: MarkdownHtmlComponent
  font_size: 'sm' | 'md' | 'lg' | 'xl'
}

export type StoryblokBlock = SBHeadlineBlock | SBSpacerBlock | SBPlainTextBlock

export interface StoryblokLinkItem {
  id: number
  slug: string
  name: string
  is_folder: boolean
  parent_id: number
  published: boolean
  path: string | null
  position: number
  uuid: string
  is_startpage: boolean
  real_path: string
}

interface PageComponent {
  _uid: '4ac3d3bb-4bf5-4b4e-a8b8-ed52cce15635'
  body: Array<StoryblokBlock>
  component: 'page'
  hide_footer: boolean
  page_title: string
  public: boolean
  robots: 'index' | 'noindex'
  seo_meta_description: string
  seo_meta_og_description: string
  seo_meta_og_image: string
  seo_meta_og_title: string
  seo_meta_title: string
}

export type PageStoryData = StoryData<PageComponent>
