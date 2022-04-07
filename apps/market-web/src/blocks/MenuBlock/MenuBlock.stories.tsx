import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { headerMenuItems } from 'test-utils/storyblock-test-util'
import { MenuBlock } from './MenuBlock'



export default {
  title: 'Market Web / Blocks / MenuBlock',
  component: MenuBlock,
  args: {
    _uid: '1234',
    component: 'banner_block',
    items: headerMenuItems,
  },
} as ComponentMeta<typeof MenuBlock>

const Template: ComponentStory<typeof MenuBlock> = (args) =>
<MenuBlock {...args} />

export const Default = Template.bind({})
