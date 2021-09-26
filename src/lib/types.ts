export type StoryblokComponentName = 'hero_block' | 'spacer_block' | 'column_text_block'

interface StoryblokBaseBlock {
  _uid: string
  component: StoryblokComponentName
}

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

export interface StoryblokPageItem {
  id: string
  name: string
  full_slug: string
  content: {
    _uid: string
    page_title: string
    component: string
    hide_footer: boolean
    robots: string
    seo_meta_title: string
    seo_meta_og_image: string
    seo_meta_og_title: string
    seo_meta_description: string
    seo_meta_og_description: string
    body: Array<StoryblokBlock>
  }
}
