import { ComponentMeta, ComponentStory } from '@storybook/react'
import { link } from '@/helpers/mockedData'
import { minimalColorMap } from '@/helpers/storybook'
import { CtaBlock } from './CtaBlock'

export default {
  title: 'Market Web / Blocks / CtaBlock',
  component: CtaBlock,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    color: {
      options: Object.keys(minimalColorMap),
      mapping: minimalColorMap,
    },
    cta_color: {
      options: Object.keys(minimalColorMap),
      mapping: minimalColorMap,
    },
  },
  args: {
    _uid: '1234',
    component: 'cta_block',
    color: minimalColorMap['standard-inverse'],
    cta_color: minimalColorMap['standard-inverse'],
    cta_label: 'Läs mer om vårt skydd',
    cta_link: link,
    cta_style: 'outlined',
    cta_size: 'lg',
    size: 'sm',
  },
} as ComponentMeta<typeof CtaBlock>

const Template: ComponentStory<typeof CtaBlock> = (args) => <CtaBlock {...args} />

export const Default = Template.bind({})
