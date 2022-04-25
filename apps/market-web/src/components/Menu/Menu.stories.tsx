import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider-11.1'
import React from 'react'
import { Button } from 'ui'
import { headerMenuItems } from '@/helpers/mockedData'
import { Menu } from './Menu'

export default {
  title: 'Market Web / Components / Menu',
  component: Menu,
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
} as ComponentMeta<typeof Menu>

const Template: ComponentStory<typeof Menu> = (args) => (
  <MemoryRouterProvider url="/initial-url">
    <Menu {...args} />
  </MemoryRouterProvider>
)

export const Default = Template.bind({})
Default.args = {}

export const WithCTA = Template.bind({})
WithCTA.args = {
  cta: (
    <Button fullWidth={true} variant="outlined" color={'light'}>
      Sign up!
    </Button>
  ),
}
