import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { minimalColorMap } from '@/helpers/storybook'
import { MarkdownHtmlComponent } from '@/services/storyblok/types'
import { BannerBlock } from './BannerBlock'

const exampleText: MarkdownHtmlComponent = {
  _uid: '1234',
  html: '<p>4.9/5 stars on Trustpilot</p>',
  original: '<p>4.9/5 stars on Trustpilot</p>',
  plugin: 'markdown-html',
}

export default {
  title: 'Market Web / Blocks / BannerBlock',
  component: BannerBlock,
  args: {
    _uid: '1234',
    component: 'banner_block',
    color: minimalColorMap['standard'],
    text: exampleText,
  },
} as ComponentMeta<typeof BannerBlock>

const Template: ComponentStory<typeof BannerBlock> = (args) => <BannerBlock {...args} />

export const Default = Template.bind({})
