import { ComponentMeta, Story } from '@storybook/react'
import { TopMenuDesktop } from './TopMenuDesktop'

export default {
  title: 'TopMenuDesktop',
  component: TopMenuDesktop,
} as ComponentMeta<typeof TopMenuDesktop>

export type TopMenuDesktopProps = {
  isOpen: boolean
  currentActiveItem: string
}

const Template: Story<TopMenuDesktopProps> = (props) => <TopMenuDesktop {...props} />

export const Desktop = Template.bind({})
Desktop.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
}
