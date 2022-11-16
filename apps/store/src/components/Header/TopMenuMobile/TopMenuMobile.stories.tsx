import { ComponentMeta, Story } from '@storybook/react'
import { TopMenuMobile } from './TopMenuMobile'

export default {
  title: 'TopMenuMobile',
  component: TopMenuMobile,
} as ComponentMeta<typeof TopMenuMobile>

export type TopMenuMobileProps = {
  isOpen: boolean
  currentActiveItem: string
}

const Template: Story<TopMenuMobileProps> = (props) => <TopMenuMobile {...props} />

export const Mobile = Template.bind({})
Mobile.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
}
