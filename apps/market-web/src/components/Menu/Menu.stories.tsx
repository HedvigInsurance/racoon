import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider-11.1'
import React from 'react'
import { Button } from 'ui'
import { headerMenuItems } from '@/helpers/mockedData'
import { MenuBlock } from './Menu'

export default {
  title: 'Market Web / Components / Menu',
  component: MenuBlock,
  args: {
    _uid: '1234',
    component: 'banner_block',
    items: headerMenuItems,
  },
  argTypes: {
    cta: {
      control: {
        type: null,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
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

export const WithCTA = Template.bind({})
WithCTA.args = {
  isOpen: true,
  cta: (
    <Button fullWidth={true} variant="outlined" color={'light'}>
      Sign up!
    </Button>
  ),
}
