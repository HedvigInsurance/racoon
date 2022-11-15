import { ComponentMeta, Story } from '@storybook/react'
import { TopMenu } from './TopMenu'

export default {
  title: 'TopMenu',
  component: TopMenu,
} as ComponentMeta<typeof TopMenu>

export type TopMenuProps = {
  isOpen: boolean
  currentActiveItem: string
}

const Template: Story<TopMenuProps> = (props) => <TopMenu {...props} />

export const Mobile = Template.bind({})
Mobile.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
}
