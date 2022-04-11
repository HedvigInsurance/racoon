import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider-11.1'
import React from 'react'
import { headerMenuItems } from '@/helpers/mockedData'
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

const Template: ComponentStory<typeof MenuBlock> = (args) => (
  <MemoryRouterProvider url="/initial-url">
    <MenuBlock {...args} />
  </MemoryRouterProvider>
)

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
}
