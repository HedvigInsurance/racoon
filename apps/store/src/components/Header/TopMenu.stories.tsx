import { ComponentMeta, Story } from '@storybook/react'
import { TopMenu } from './TopMenu'

export default {
  title: 'TopMenu',
  component: TopMenu,
} as ComponentMeta<typeof TopMenu>

export type Props = {
  isOpen: boolean
  currentActiveItem: string
}

const Template: Story<Props> = (props) => <TopMenu {...props} />

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  currentActiveItem: 'insurances',
}
