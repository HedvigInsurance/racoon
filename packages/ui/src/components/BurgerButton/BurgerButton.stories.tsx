import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BurgerButton, BurgerButtonProps } from './BurgerButton'

export default {
  title: 'Button / BurgerButton',
  component: BurgerButton,
  argsTypes: { onClick: { action: 'clicked' } },
} as ComponentMeta<typeof BurgerButton>

const Template: ComponentStory<typeof BurgerButton> = (props: BurgerButtonProps) => {
  return <BurgerButton {...props} />
}

export const Default = Template.bind({})
Default.args = {}
