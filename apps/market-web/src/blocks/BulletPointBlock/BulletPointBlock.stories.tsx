import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FontSizes } from 'components/Heading/Heading'
import { minimalColorMap } from '@/helpers/storybook'
import { MarkdownHtmlComponent } from '@/services/storyblok/types'
import { BulletPointBlock } from './BulletPointBlock'

export default {
  title: 'Market Web / Blocks / BulletPointBlock',
  component: BulletPointBlock,
} as ComponentMeta<typeof BulletPointBlock>

const text: MarkdownHtmlComponent = {
  _uid: '5',
  html: '<p>Hedvig has an ‘Excellent’ rating from Trustpilot with 4,8/5 stars based on 1000+ reviews.</p>',
  original:
    '<p>Hedvig has an ‘Excellent’ rating from Trustpilot with 4,8/5 stars based on 1000+ reviews.</p>',
  plugin: 'markdown-html',
}

const bulletPointsIcon = [
  {
    _uid: '4678',
    component: 'bullet_point_item',
    image: 'icons/hedvig_reviews_trustpilot.svg',
    icon_layout: false,
    title: 'Trustpilot rating: Excellent',
    title_size: 'xs' as FontSizes,
    title_size_mobile: 'sm' as FontSizes,
    paragraph: text,
  },
  {
    _uid: '9678',
    component: 'bullet_point_item',
    image: 'icons/hedvig_reviews_apple.svg',
    icon_layout: true,
    title: 'iOS app rating: 4,7/5 stars',
    title_size: 'xs' as FontSizes,
    title_size_mobile: 'sm' as FontSizes,
    paragraph: text,
  },
  {
    _uid: '1678',
    component: 'bullet_point_item',
    image: 'icons/hedvig_reviews_claims_rating.svg',
    icon_layout: true,
    title: 'Claims rating: 4,7/5 stars',
    title_size: 'xs' as FontSizes,
    title_size_mobile: 'sm' as FontSizes,
    paragraph: text,
  },
]

const Template: ComponentStory<typeof BulletPointBlock> = (args) => <BulletPointBlock {...args} />

export const Default = Template.bind({})

Default.args = {
  _uid: '9123',
  component: 'bullet_point_block',
  color_body: minimalColorMap['gray700'],
  bullet_points: bulletPointsIcon,
}
