import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { minimalColorMap } from '@/helpers/storybook'
import { MarkdownHtmlComponent } from '@/services/storyblok/types'
import { HeroBlock, HeroBlockProps } from './HeroBlock'

export default {
  title: 'Market Web / Blocks / HeroBlock',
  component: HeroBlock,
} as ComponentMeta<typeof HeroBlock>

const heroText: MarkdownHtmlComponent = {
  _uid: '1234',
  html: '<p>Omfattande skydd för dig, din lägenhet och dina saker. <br/>Bostadsrättstillägg ingår alltid.</p>',
  original:
    '<p>Omfattande skydd för dig, din lägenhet och dina saker. <br/>Bostadsrättstillägg ingår alltid.</p>',
  plugin: 'markdown-html',
}

const image = 'https://source.unsplash.com/user/heytowner/?orientation=landscape'

const Template: ComponentStory<typeof HeroBlock> = (args: HeroBlockProps) => <HeroBlock {...args} />

export const Default = Template.bind({})
Default.args = {
  headline: 'Bostadsrätt',
  animate: true,
  text: heroText,
  headline_font_size_mobile: 'md',
  headline_font_size: 'sm',
  color: minimalColorMap['standard-inverse'],

  text_color: minimalColorMap['standard-inverse'],

  text_position: 'left',
  image: image,
  image_mobile: image,
  hide_bg_tint: false,
  show_hedvig_wordmark: true,
}

export const WithCTA = Template.bind({})
WithCTA.args = {
  animate: true,
  headline: 'Hjälp så som du aldrig kunnat <br/>föreställa dig den',
  headline_font_size_mobile: 'md',
  headline_font_size: 'sm',
  show_cta: true,
  cta_label: 'Läs mer',
  cta_style: 'outlined',
  cta_color: minimalColorMap['standard-inverse'],
  color: minimalColorMap['standard-inverse'],
  text_color: minimalColorMap['standard-inverse'],
  text_position: 'left',
  image: image,
  image_mobile: image,
  hide_bg_tint: false,
  show_hedvig_wordmark: false,
}

export const WithoutImage = Template.bind({})
WithoutImage.args = {
  headline: 'Bostadsrätt',
  headline_font_size_mobile: 'md',
  headline_font_size: 'sm',
  color: minimalColorMap['standard-inverse'],
  text_color: minimalColorMap['standard-inverse'],
  hide_bg_tint: false,
  text: heroText,
  show_hedvig_wordmark: false,
}
