import { ComponentStory, ComponentMeta } from '@storybook/react';
import { minimalColorMap, fontSizes } from 'helpers/storybook'
import { HeadlineBlock, HeadlineBlockProps } from './HeadlineBlock'

export default {
  title: 'Market Web / Blocks / HeadlineBlock',
  component: HeadlineBlock,
  args: {
    _uid: '1234',
    component: 'headline_block',
    color: minimalColorMap['standard'],
    capitalize: false,
    element: 'h2',
    show_hedvig_wordmark: false,
    text: 'Insurance, for the way people live today',
    text_position: 'center',
    font_size: 'sm',
    use_display_font: false
  }
} as ComponentMeta<typeof HeadlineBlock>;

const Template: ComponentStory<typeof HeadlineBlock> = (args) => <HeadlineBlock {...args} />;

export const Default = Template.bind({})
