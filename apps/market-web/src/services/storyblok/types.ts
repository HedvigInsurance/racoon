import type { StoryData, StoryblokComponent } from 'storyblok-js-client'
import { SectionSize } from '@/blocks/blockHelpers'

export type ImageUrl = string

export type minimalColorComponentColors =
  | 'standard'
  | 'standard-inverse'
  | 'gray700'
  | 'gray500-inverse'
  | 'purple300'
  | 'purple500'

export interface MinimalColorComponent {
  _uid: string
  plugin: 'hedvig_minimal_color_picker'
  color: minimalColorComponentColors
}

export interface MarkdownHtmlComponent {
  _uid: string
  html: string
  original: string
  plugin: 'markdown-html'
}

export interface TextField {
  _uid: string
  text: string
  component: string
}

export type StoryblokComponentName =
  | 'accordion_block'
  | 'banner_block'
  | 'bullet_point_block'
  | 'column_text_block'
  | 'headline_block'
  | 'spacer_block'
  | 'plain_text_block'

export interface StoryblokBaseBlock extends StoryblokComponent<StoryblokComponentName> {
  color?: MinimalColorComponent
  size?: SectionSize
  extra_styling?: string
  index?: number
}

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
  body: Array<StoryblokBaseBlock>
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
