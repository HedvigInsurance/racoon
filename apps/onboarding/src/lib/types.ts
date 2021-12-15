import type { StoryblokComponent, StoryData } from "storyblok-js-client"

export type StoryblokComponentName = 'hero_block' | 'spacer_block' | 'column_text_block'

interface StoryblokBaseBlock extends StoryblokComponent<StoryblokComponentName> {}

export interface SBHeroBlock extends StoryblokBaseBlock {
  component: 'hero_block'
  text: { html: string }
  image: string
  image_mobile: string
  height: string
  cta_link: { url: string }
  headline: string
  show_cta: boolean
  cta_label: string
  cta_style: string
  text_position: string
  headline_font_size: string
  headline_font_size_mobile: string
}

export interface SBSpacerBlock extends StoryblokBaseBlock {
  component: 'spacer_block'
  size: string
}

export interface SBColumnTextBlock extends StoryblokBaseBlock {
  component: 'column_text_block'
  text_one: { html: string }
  text_two: { html: string }
}

export type StoryblokBlock = SBHeroBlock | SBSpacerBlock | SBColumnTextBlock

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
  _uid: "4ac3d3bb-4bf5-4b4e-a8b8-ed52cce15635"
  body: Array<StoryblokBlock>
  component: "page"
  hide_footer: boolean
  page_title: string
  public: boolean
  robots: "index" | "noindex"
  seo_meta_description: string
  seo_meta_og_description: string
  seo_meta_og_image: string
  seo_meta_og_title: string
  seo_meta_title: string
}

export type PageStoryData = StoryData<PageComponent>
